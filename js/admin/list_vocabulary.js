
const API_BASE_URL = 'http://127.0.0.1:8000/vocabulary/';

// Helper function to show/hide loading indicator (optional, but good practice)
function showLoading() {
    // Implement a loading spinner or message
    console.log('Loading...');
}

function hideLoading() {
    // Hide the loading spinner or message
    console.log('Loading complete.');
}

// Fetch vocabulary list from API
async function fetchVocabularies(classId = 1) { // Default to class_id=1 for now
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}?class_id=${classId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        renderVocabTable(data);
    } catch (error) {
        console.error('Error fetching vocabularies:', error);
        alert('Không thể tải danh sách từ vựng.');
    } finally {
        hideLoading();
    }
}

// Add new vocabulary
async function addVocabulary(vocabData) {
    showLoading();
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vocabData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
        }
        alert('Thêm từ vựng thành công!');
        closeModal();
        fetchVocabularies(); // Reload data
    } catch (error) {
        console.error('Error adding vocabulary:', error);
        alert('Không thể thêm từ vựng mới.');
    } finally {
        hideLoading();
    }
}

// Update existing vocabulary
async function updateVocabulary(id, vocabData) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}${id}`, {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vocabData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
        }
        alert('Cập nhật từ vựng thành công!');
        closeModal();
        fetchVocabularies(); // Reload data
    } catch (error) {
        console.error('Error updating vocabulary:', error);
        alert('Không thể cập nhật từ vựng.');
    } finally {
        hideLoading();
    }
}

// Delete vocabulary
async function deleteVocabulary(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa từ vựng này?')) {
        return;
    }
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}${id}`, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        alert('Xóa từ vựng thành công!');
        fetchVocabularies(); // Reload data
    } catch (error) {
        console.error('Error deleting vocabulary:', error);
        alert('Không thể xóa từ vựng.');
    } finally {
        hideLoading();
    }
}

// Fetch single vocabulary for editing
async function getVocabularyById(id) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}${id}`, {
            headers: {
                'accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching vocabulary by ID:', error);
        alert('Không thể tải thông tin từ vựng để chỉnh sửa.');
        return null;
    } finally {
        hideLoading();
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // feather.replace(); // No longer needed with Font Awesome
    AOS.init();
    
    // Modal controls
    const modal = document.getElementById('vocabModal');
    const addVocabBtn = document.getElementById('addVocabBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalTitle = document.getElementById('modalTitle');
    const vocabForm = document.getElementById('vocabForm');
    const filterClassId = document.getElementById('filterClassId'); // New filter dropdown

    // Initial load of vocabulary data based on filter
    fetchVocabularies(filterClassId.value === 'all' ? null : parseInt(filterClassId.value));

    // Event listener for classId filter change
    filterClassId.addEventListener('change', function() {
        const selectedClassId = this.value;
        fetchVocabularies(selectedClassId === 'all' ? null : parseInt(selectedClassId));
    });
    
    // Show modal for adding new vocabulary
    addVocabBtn.addEventListener('click', function() {
        modalTitle.textContent = "Thêm từ vựng mới";
        vocabForm.reset();
        document.getElementById('vocabId').value = '';
        document.getElementById('audioPreview').classList.add('hidden');
        document.getElementById('frontImagePreview').classList.add('hidden');
        document.getElementById('backImagePreview').classList.add('hidden');
        modal.classList.remove('hidden');
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Handle form submission
    vocabForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const vocabId = document.getElementById('vocabId').value;
        const isEdit = vocabId !== '';
        
        const vocabData = {
            class_id: parseInt(document.getElementById('classId').value),
            kanji: document.getElementById('kanji').value || null,
            hiragana: document.getElementById('hiragana').value,
            romaji: document.getElementById('romaji').value,
            nghia: document.getElementById('meaning').value,
            audio_url: document.getElementById('audioUrl').value || null, // Assuming audioUrl is a direct input now
            image_ids: [], // Assuming image_ids are not handled via file upload in this iteration
            sort_order: parseInt(document.getElementById('sortOrder').value) || 0
        };

        // For image_ids, if you have a way to get them (e.g., hidden inputs after upload), populate them here.
        // For now, it's an empty array as per the curl example.
        
        if (isEdit) {
            await updateVocabulary(vocabId, vocabData);
        } else {
            await addVocabulary(vocabData);
        }
    });
    
    // File preview handlers (kept for potential future use, but not directly used for API calls in this iteration)
    document.getElementById('audioUrl').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const preview = document.getElementById('audioPreview');
            const audio = preview.querySelector('audio source');
            audio.src = URL.createObjectURL(file);
            preview.classList.remove('hidden');
            // You might want to store the file or its URL for submission
            // document.getElementById('audioUrl').value = URL.createObjectURL(file); // Example: if audioUrl is a direct input
        }
    });
    
    document.getElementById('frontImagePreview').addEventListener('click', function(e) {
        const file = e.target.files[0];
        if (file) {
            const preview = document.getElementById('frontImagePreview');
            const img = preview.querySelector('img');
            img.src = URL.createObjectURL(file);
            preview.classList.remove('hidden');
        }
    });
    
    document.getElementById('backImagePreview').addEventListener('click', function(e) {
        const file = e.target.files[0];
        if (file) {
            const preview = document.getElementById('backImagePreview');
            const img = preview.querySelector('img');
            img.src = URL.createObjectURL(file);
            preview.classList.remove('hidden');
        }
    });
});

// Close modal (moved to global scope)
function closeModal() {
    const modal = document.getElementById('vocabModal');
    modal.classList.add('hidden');
}

// Render vocabulary table
function renderVocabTable(data) {
    const tableBody = document.getElementById('vocabTableBody');
    tableBody.innerHTML = '';
    
    data.forEach(vocab => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-orange-100';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vocab.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vocab.class_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vocab.kanji || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vocab.hiragana}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vocab.romaji}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vocab.nghia}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${vocab.audio_url ? `<i class="fas fa-volume-up audio-icon" data-audio-url="${vocab.audio_url}"></i>` : '-'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex space-x-2">
                    ${vocab.image_ids && vocab.image_ids.length > 0 ? 
                        vocab.image_ids.map(id => `<img src="http://static.photos/education/120x90/${id}" class="flashcard-thumb">`).join('')
                        : '-'}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button class="text-orange-600 hover:text-orange-900 mr-3 edit-btn" data-id="${vocab.id}">
                    <i class="fas fa-edit w-4 h-4"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${vocab.id}">
                    <i class="fas fa-trash-alt w-4 h-4"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Re-initialize Feather Icons for new elements
    // feather.replace(); // No longer needed with Font Awesome
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const vocabId = this.getAttribute('data-id');
            editVocabulary(vocabId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const vocabId = this.getAttribute('data-id');
            deleteVocabulary(vocabId);
        });
    });
    
    // Add event listeners for audio icons
    document.querySelectorAll('.audio-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const audioUrl = this.getAttribute('data-audio-url');
            if (audioUrl) {
                const audio = new Audio(audioUrl);
                audio.play();
            } else {
                alert('Không có URL âm thanh.');
            }
        });
    });
}

// Edit vocabulary
async function editVocabulary(id) {
    const vocab = await getVocabularyById(id);
    if (!vocab) return;

    const modal = document.getElementById('vocabModal');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = "Chỉnh sửa từ vựng";
    document.getElementById('vocabId').value = vocab.id;
    document.getElementById('classId').value = vocab.class_id;
    document.getElementById('kanji').value = vocab.kanji || '';
    document.getElementById('hiragana').value = vocab.hiragana;
    document.getElementById('romaji').value = vocab.romaji;
    document.getElementById('meaning').value = vocab.nghia;
    document.getElementById('sortOrder').value = vocab.sort_order;
    document.getElementById('audioUrl').value = vocab.audio_url || ''; // Populate audioUrl input

    // Handle audio preview
    const audioPreview = document.getElementById('audioPreview');
    const audioSource = audioPreview.querySelector('audio source');
    if (vocab.audio_url) {
        audioSource.src = vocab.audio_url;
        audioPreview.classList.remove('hidden');
    } else {
        audioPreview.classList.add('hidden');
    }
    
    // Image previews (assuming image_ids are just IDs, not direct URLs for preview)
    // You might need a more sophisticated way to handle image previews if they are actual files or full URLs
    document.getElementById('frontImagePreview').classList.add('hidden');
    document.getElementById('backImagePreview').classList.add('hidden');
    
    modal.classList.remove('hidden');
}

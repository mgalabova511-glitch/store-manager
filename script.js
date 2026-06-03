
document.addEventListener('DOMContentLoaded', () => {
    // ВАЖНО: Вече сочим към нашия локален сървър
    const apiUrl = 'http://localhost:3000/products'; 
    
    // Елементи
    const productsView = document.getElementById('products-view');
    const formView = document.getElementById('form-view');
    const tableBody = document.querySelector('#productsTable tbody');
    const messageDiv = document.getElementById('message');
    
    // Форма
    const formTitle = document.getElementById('formTitle');
    const inputId = document.getElementById('editId');
    const inputTitle = document.getElementById('title');
    const inputPrice = document.getElementById('price');
    const inputCategory = document.getElementById('category'); // Това ще стане обикновен input или select с hardcoded стойности
    const inputDesc = document.getElementById('description');

    // --- ПОМОЩНИ ФУНКЦИИ ---
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => messageDiv.style.display = 'none', 5000);
    }

    function switchView(viewName) {
        if (viewName === 'form') {
            productsView.classList.add('hidden');
            formView.classList.remove('hidden');
        } else {
            formView.classList.add('hidden');
            productsView.classList.remove('hidden');
        }
    }

    function clearForm() {
        inputId.value = ''; 
        inputTitle.value = '';
        inputPrice.value = '';
        inputDesc.value = '';
        inputCategory.value = 'Electronics'; // Default
        formTitle.textContent = 'Добави нов продукт';
    }

    // Заместваме API-то за категории с локален списък, за да е по-просто заданието
    function loadCategories() {
        inputCategory.innerHTML = `
            <option value="Electronics">Electronics</option>
            <option value="Clothes">Clothes</option>
            <option value="Furniture">Furniture</option>
            <option value="Others">Others</option>
        `;
    }

    // --- ЗАРЕЖДАНЕ НА ПРОДУКТИ (GET) ---
    async function loadProducts() {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Зареждане на данни...</td></tr>';
        
        try {
            // Можеш да тестваш и лимита тук: fetch(apiUrl + '?limit=5')
            const response = await fetch(apiUrl);
            if(!response.ok) throw new Error("Server error");
            const data = await response.json();
            renderTable(data); 
        } catch (error) {
            console.error(error);
            tableBody.innerHTML = '<tr><td colspan="6" style="color:red; text-align:center;">Грешка при връзка със сървъра. Пуснат ли е backend.js?</td></tr>';
        }
    }

    function renderTable(products) {
        tableBody.innerHTML = ''; 

        if (products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Няма налични продукти.</td></tr>';
            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');
            
            // Проверка за снимка (в DB е просто стринг, не масив)
            const imgUrl = product.image ? product.image : 'https://placehold.co/50';
            const catName = product.category || 'Без категория';

            row.innerHTML = `
                <td style="color: #6b7280; font-family: monospace;">#${product.id}</td>
                <td><img src="${imgUrl}" class="product-thumb" alt="img" onerror="this.src='https://placehold.co/50'"></td>
                <td style="font-weight: 500;">${product.title}</td>
                <td style="font-weight: 600; color: #10b981;">$${product.price}</td>
                <td><span style="background: #eef2ff; color: #6366f1; padding: 4px 8px; border-radius: 4px; font-size: 0.85em;">${catName}</span></td>
                <td class="text-right">
                    <button class="btn btn-edit" onclick="prepareEdit(${product.id})">Редакция</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Изтрий</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // --- ИЗТРИВАНЕ (DELETE) ---
    window.deleteProduct = async (id) => {
        if (!confirm(`Сигурни ли сте за изтриване на продукт ID: ${id}?`)) return;

        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                showMessage('Продуктът е изтрит успешно!', 'success');
                loadProducts(); 
            } else {
                showMessage('Грешка при изтриване.', 'error');
            }
        } catch (error) {
            showMessage('Мрежова грешка.', 'error');
        }
    };

    // --- ПОДГОТОВКА ЗА РЕДАКЦИЯ (GET ONE) ---
    window.prepareEdit = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`);
            const product = await response.json();

            inputId.value = product.id;
            inputTitle.value = product.title;
            inputPrice.value = product.price;
            inputDesc.value = product.description;
            inputCategory.value = product.category;

            formTitle.textContent = `Редактиране на продукт #${product.id}`;
            switchView('form');
        } catch (error) {
            showMessage('Грешка при зареждане на данните за редакция.', 'error');
        }
    };

    // --- ЗАПАЗВАНЕ (POST / PUT) ---
    document.getElementById('btnSave').addEventListener('click', async () => {
        const title = inputTitle.value.trim();
        const price = parseFloat(inputPrice.value);
        const desc = inputDesc.value.trim();
        const category = inputCategory.value;
        const id = inputId.value;

        if (!title || !desc) {
            showMessage('Моля, попълнете заглавие и описание.', 'error');
            return;
        }

        const payload = {
            title: title,
            price: price,
            description: desc,
            category: category,
            image: "https://placehold.co/600x400" // Hardcoded за простота
        };

        try {
            let response;
            
            if (id) {
                // PUT (Редакция)
                response = await fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // POST (Създаване)
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (response.ok) {
                showMessage(id ? 'Успешно обновен!' : 'Успешно създаден!', 'success');
                switchView('list'); 
                loadProducts(); 
            } else {
                const errorData = await response.json();
                showMessage('Грешка: ' + (errorData.error || 'Server error'), 'error');
            }

        } catch (error) {
            showMessage('Мрежова грешка: ' + error.message, 'error');
        }
    });

    // Бутони
    document.getElementById('btnOpenAdd').addEventListener('click', () => {
        clearForm();
        switchView('form');
    });

    document.getElementById('btnCancel').addEventListener('click', () => {
        switchView('list');
    });

    // Стартиране
    loadCategories();
    loadProducts();
});

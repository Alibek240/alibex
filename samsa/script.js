const USERS_API = 'https://dummyjson.com/users';

let users = [];
let currentView = 'table'; // Ағымдағы көрініс: 'table' немесе 'grid'

let products = [
    {
        id: 1,
        title: "Apple iPhone 16 Pro",
        category: "Электроника",
        price: 646000,
        stock: 15,
        thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100",
        user: { id: 1, firstName: "John", lastName: "Doe", username: "johndoe", image: "https://dummyjson.com/icon/johndoe/128", email: "john@mail.com", phone: "+1 234 567 890", company: { name: "Apple Inc" } }
    },
    {
        id: 2,
        title: "Chanel Coco Noir",
        category: "Парфюмерия",
        price: 52800,
        stock: 25,
        thumbnail: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=100",
        user: { id: 2, firstName: "Emma", lastName: "Watson", username: "emmaw", image: "https://dummyjson.com/icon/emmaw/128", email: "emma@mail.com", phone: "+1 987 654 321", company: { name: "Beauty Corp" } }
    },
    {
        id: 3,
        title: "Dior Face Serum",
        category: "Косметикалар",
        price: 38400,
        stock: 8,
        thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100",
        user: { id: 3, firstName: "Michael", lastName: "Johnson", username: "michaelj", image: "https://dummyjson.com/icon/michaelj/128", email: "michael@mail.com", phone: "+1 555 444 333", company: { name: "Dior Global" } }
    },
    {
        id: 4,
        title: "Dyson V15 Detect",
        category: "Тұрмыстық-техника",
        price: 336000,
        stock: 12,
        thumbnail: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=100",
        user: { id: 4, firstName: "Sarah", lastName: "Connor", username: "sarahc", image: "https://dummyjson.com/icon/sarahc/128", email: "sarah@mail.com", phone: "+1 111 222 333", company: { name: "Dyson Ltd" } }
    },
    {
        id: 5,
        title: "Лофт стильдегі кресло",
        category: "Жиһаз",
        price: 110400,
        stock: 5,
        thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100",
        user: { id: 5, firstName: "David", lastName: "Smith", username: "davids", image: "https://dummyjson.com/icon/davids/128", email: "david@mail.com", phone: "+1 777 888 999", company: { name: "Modern Home" } }
    }
];

const mainView = document.getElementById('main-view');
const profileView = document.getElementById('profile-view');
const form = document.getElementById('product-form');
const editForm = document.getElementById('edit-form');
const editModal = document.getElementById('edit-modal');
const tableBody = document.getElementById('product-table-body');
const gridContainer = document.getElementById('grid-view-container');
const tableViewContainer = document.getElementById('table-view-container');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');

function showMainView() {
    profileView.classList.add('hidden');
    mainView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showProfileView(userId) {
    const foundUser = users.find(u => u.id === userId);
    if (!foundUser) return;

    document.getElementById('prof-avatar').src = foundUser.image;
    document.getElementById('prof-name').innerText = `${foundUser.firstName} ${foundUser.lastName}`;
    document.getElementById('prof-username').innerText = `@${foundUser.username}`;
    document.getElementById('prof-email').innerText = foundUser.email;
    document.getElementById('prof-phone').innerText = foundUser.phone;
    document.getElementById('prof-company').innerText = foundUser.company.name;

    const userProductsList = document.getElementById('user-products-list');
    userProductsList.innerHTML = '';

    const userProducts = products.filter(p => p.user && p.user.id === userId);

    if (userProducts.length === 0) {
        userProductsList.innerHTML = `<p class="text-gray-400 text-sm col-span-2 py-4">Бұл қолданушы әзірге тауар қосқан жоқ.</p>`;
    } else {
        userProducts.forEach(p => {
            const card = document.createElement('div');
            card.className = "flex items-center gap-4 bg-gray-50 p-3 rounded-xl border";
            card.innerHTML = `
                <img src="${p.thumbnail || p.image}" class="w-14 h-14 object-cover rounded-lg border">
                <div>
                    <h4 class="font-semibold text-gray-800 text-sm">${p.title || p.name}</h4>
                    <p class="text-xs text-blue-600 font-medium">${p.category}</p>
                    <p class="text-xs font-bold text-gray-700 mt-1">${Number(p.price).toLocaleString('kk-KZ')} ₸</p>
                </div>
            `;
            userProductsList.appendChild(card);
        });
    }

    mainView.classList.add('hidden');
    profileView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Көрініс түрін ауыстыру функциясы (Тізім / Қатарымен)
window.switchView = function(viewType) {
    currentView = viewType;
    const tableBtn = document.getElementById('view-table-btn');
    const gridBtn = document.getElementById('view-grid-btn');

    if (viewType === 'table') {
        tableViewContainer.classList.remove('hidden');
        gridContainer.classList.add('hidden');
        tableBtn.className = "w-9 h-9 flex items-center justify-center rounded-md transition bg-white text-blue-600 shadow-sm";
        gridBtn.className = "w-9 h-9 flex items-center justify-center rounded-md transition text-gray-600 hover:text-gray-800";
    } else {
        tableViewContainer.classList.add('hidden');
        gridContainer.classList.remove('hidden');
        gridBtn.className = "w-9 h-9 flex items-center justify-center rounded-md transition bg-white text-blue-600 shadow-sm";
        tableBtn.className = "w-9 h-9 flex items-center justify-center rounded-md transition text-gray-600 hover:text-gray-800";
    }
    renderProducts();
};

function reindexProducts() {
    products = products.map((p, index) => ({
        ...p,
        id: index + 1
    }));
}

async function fetchInitialData() {
    try {
        const userRes = await fetch(USERS_API);
        const userData = await userRes.json();
        users = userData.users;

        let savedProducts = JSON.parse(localStorage.getItem('producthub_products'));
        let isInitialized = localStorage.getItem('producthub_initialized');

        if (!isInitialized) {
            localStorage.setItem('producthub_products', JSON.stringify(products));
            localStorage.setItem('producthub_initialized', 'true');
        } else if (savedProducts) {
            products = savedProducts;
        }

        reindexProducts();
        updateCategoryDropdowns();
        renderProducts();
        updateStats();
    } catch (error) {
        console.error('Қате кетті:', error);
    }
}

function saveToLocalStorage() {
    localStorage.setItem('producthub_products', JSON.stringify(products));
}

function updateCategoryDropdowns() {
    const predefinedCategories = ['Электроника', 'Парфюмерия', 'Косметикалар', 'Тұрмыстық-техника', 'Жиһаз'];
    const categorySelects = [document.getElementById('category'), document.getElementById('edit-category'), categoryFilter];
    
    categorySelects.forEach((select, index) => {
        if (!select) return;
        const currentVal = select.value;
        if (index === 2) select.innerHTML = '<option value="">Барлық санаттар</option>';
        else select.innerHTML = '';

        predefinedCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
        select.value = currentVal;
    });
}

function formatMoney(amount) {
    return Number(amount).toLocaleString('kk-KZ') + ' ₸';
}

function renderProducts() {
    tableBody.innerHTML = '';
    gridContainer.innerHTML = '';
    
    let filtered = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchInput.value.toLowerCase());
        const matchesCategory = categoryFilter.value === '' || p.category === categoryFilter.value;
        return matchesSearch && matchesCategory;
    });

    if (sortFilter.value === 'newest') filtered.sort((a, b) => b.id - a.id);
    if (sortFilter.value === 'oldest') filtered.sort((a, b) => a.id - b.id);
    if (sortFilter.value === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sortFilter.value === 'price-low') filtered.sort((a, b) => a.price - b.price);

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-gray-400">Тауарлар табылмады</td></tr>`;
        gridContainer.innerHTML = `<p class="text-center py-6 text-gray-400 col-span-full">Тауарлар табылмады</p>`;
        return;
    }

    filtered.forEach((p, index) => {
        const user = p.user || { id: 1, firstName: 'Әкімші', lastName: '', username: 'admin', image: 'https://via.placeholder.com/30' };
        const fullName = `${user.firstName} ${user.lastName}`;

        // 1. Тізім түрі (Кесте)
        const row = document.createElement('tr');
        row.className = "hover:bg-gray-50";
        row.innerHTML = `
            <td class="py-3 px-2 text-gray-500 font-medium">#${index + 1}</td>
            <td class="py-3 px-2">
                <div class="flex items-center gap-3">
                    <img src="${p.thumbnail || p.image || 'https://via.placeholder.com/40'}" alt="" class="w-9 h-9 object-cover rounded-lg border">
                    <div>
                        <span class="font-medium text-gray-800 block">${p.title || p.name}</span>
                        <div class="flex items-center gap-1.5 mt-1 cursor-pointer group" onclick="showProfileView(${user.id})">
                            <img src="${user.image}" alt="" class="w-4 h-4 rounded-full object-cover">
                            <span class="text-xs text-blue-600 group-hover:underline font-medium">@${user.username} (${fullName})</span>
                        </div>
                    </div>
                </div>
            </td>
            <td class="py-3 px-2 text-gray-600">${p.category}</td>
            <td class="py-3 px-2 font-semibold text-gray-800">${formatMoney(p.price)}</td>
            <td class="py-3 px-2 text-gray-600">${p.stock || 10} дана</td>
            <td class="py-3 px-2 text-right space-x-2">
                <button onclick="openEditModal(${p.id})" class="text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2.5 py-1.5 rounded-md font-medium"><i class="fa-solid fa-pen-to-square mr-1"></i></button>
                <button onclick="deleteProduct(${p.id})" class="text-red-600 hover:text-red-800 text-xs bg-red-50 px-2.5 py-1.5 rounded-md font-medium"><i class="fa-solid fa-trash mr-1"></i></button>
            </td>
        `;
        tableBody.appendChild(row);

        // 2. Қатарымен түрі (Карточкалар торы)
        const card = document.createElement('div');
        card.className = "bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3";
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-semibold text-gray-400">#${index + 1}</span>
                    <span class="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">${p.category}</span>
                </div>
                <div class="flex items-center gap-3">
                    <img src="${p.thumbnail || p.image || 'https://via.placeholder.com/50'}" alt="" class="w-14 h-14 object-cover rounded-lg border">
                    <div>
                        <h4 class="font-semibold text-gray-800 text-sm line-clamp-1">${p.title || p.name}</h4>
                        <p class="text-xs font-bold text-blue-600 mt-1">${formatMoney(p.price)}</p>
                    </div>
                </div>
            </div>
            <div class="pt-2 border-t flex items-center justify-between">
                <div class="flex items-center gap-1.5 cursor-pointer group" onclick="showProfileView(${user.id})">
                    <img src="${user.image}" alt="" class="w-5 h-5 rounded-full object-cover">
                    <span class="text-xs text-gray-600 group-hover:underline">@${user.username}</span>
                </div>
                <div class="space-x-1">
                    <button onclick="openEditModal(${p.id})" class="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md text-xs"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="deleteProduct(${p.id})" class="text-red-600 hover:bg-red-50 p-1.5 rounded-md text-xs"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

function updateStats() {
    const totalCount = products.length;
    const totalPrice = products.reduce((sum, p) => sum + (p.price * (p.stock || 10)), 0);
    const avgPrice = totalCount > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalCount : 0;
    const lowStockCount = products.filter(p => (p.stock || 10) < 10).length;

    document.getElementById('total-count').innerText = totalCount;
    document.getElementById('total-price').innerText = formatMoney(totalPrice);
    document.getElementById('avg-price').innerText = formatMoney(Math.round(avgPrice));
    document.getElementById('low-stock').innerText = lowStockCount;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('name').value;
    const category = document.getElementById('category').value;
    const price = Number(document.getElementById('price').value);
    const stock = Number(document.getElementById('stock').value);
    const thumbnail = document.getElementById('image').value || 'https://via.placeholder.com/40';

    const randomUser = users.length > 0 ? users[Math.floor(Math.random() * users.length)] : { id: 1, firstName: 'Әкімші', lastName: '', username: 'admin', image: 'https://via.placeholder.com/30', email: 'admin@mail.com', phone: '+77000000000', company: { name: 'ProductHub' } };

    const newProduct = {
        id: products.length + 1,
        title,
        category,
        price,
        stock,
        thumbnail,
        user: {
            id: randomUser.id,
            firstName: randomUser.firstName,
            lastName: randomUser.lastName,
            username: randomUser.username,
            image: randomUser.image,
            email: randomUser.email,
            phone: randomUser.phone,
            company: randomUser.company.name
        }
    };

    products.push(newProduct);
    reindexProducts();
    saveToLocalStorage();

    form.reset();
    renderProducts();
    updateStats();
    alert('Тауар сәтті қосылды!');
});

window.openEditModal = function(id) {
    const p = products.find(item => item.id === id);
    if (!p) return;

    document.getElementById('edit-id').value = p.id;
    document.getElementById('edit-name').value = p.title || p.name;
    document.getElementById('edit-category').value = p.category;
    document.getElementById('edit-price').value = p.price;
    document.getElementById('edit-stock').value = p.stock || 10;
    document.getElementById('edit-image').value = p.thumbnail || p.image || '';

    editModal.classList.remove('hidden');
};

window.closeEditModal = function() {
    editModal.classList.add('hidden');
};

editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = Number(document.getElementById('edit-id').value);
    const title = document.getElementById('edit-name').value;
    const category = document.getElementById('edit-category').value;
    const price = Number(document.getElementById('edit-price').value);
    const stock = Number(document.getElementById('edit-stock').value);
    const thumbnail = document.getElementById('edit-image').value;

    products = products.map(p => p.id === id ? { ...p, title, category, price, stock, thumbnail } : p);
    saveToLocalStorage();
    
    closeEditModal();
    renderProducts();
    updateStats();
    alert('Өзгерістер сәтті сақталды!');
});

window.deleteProduct = async function(id) {
    if (confirm('Бұл тауарды шынымен өшіргіңіз келе ме?')) {
        products = products.filter(p => p.id !== id);
        reindexProducts();
        saveToLocalStorage();

        renderProducts();
        updateStats();
        alert('Тауар сәтті өшірілді!');
    }
};

searchInput.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);
sortFilter.addEventListener('change', renderProducts);

fetchInitialData();
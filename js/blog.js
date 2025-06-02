document.addEventListener('DOMContentLoaded', function() {
	// Configuration
	const postsPerPage = 6;
	let currentPage = 1;
	let currentCategory = '';
	let currentSearchTerm = '';

	// DOM Elements
	const blogPostsContainer = document.getElementById('blog-posts-container');
	const paginationContainer = document.getElementById('pagination');
	const categoryFilter = document.getElementById('category-filter');
	const blogSearch = document.getElementById('blog-search');

	// Load blog data
	fetch('blog-data.json')
		.then(response => response.json())
		.then(data => {
			window.blogData = data;
			initBlog();
		})
		.catch(error => {
			console.error('Error loading blog data:', error);
			blogPostsContainer.innerHTML =
				`
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                    <h3 class="text-xl font-medium mb-2">Error Loading Posts</h3>
                    <p class="text-gray-500">Could not load blog content. Please try again later.</p>
                </div>
		`;
		});

	function initBlog() {
		// Populate category filter
		populateCategories();

		// Render initial posts
		renderPosts();
		renderPagination();

		// Event listeners
		categoryFilter.addEventListener('change', (e) => {
			currentCategory = e.target.value;
			currentPage = 1;
			renderPosts();
			renderPagination();
		});

		blogSearch.addEventListener('input', debounce((e) => {
			currentSearchTerm = e.target.value.toLowerCase();
			currentPage = 1;
			renderPosts();
			renderPagination();
		}, 300));
	}

	function populateCategories() {
		const categories = window.blogData.categories;
		categoryFilter.innerHTML = '<option value="">All Categories</option>';

		categories.forEach(category => {
			const option = document.createElement('option');
			option.value = category.name;
			option.textContent = `${category.name.charAt(0).toUpperCase() + category.name.slice(1)} (${category.count})`;
			categoryFilter.appendChild(option);
		});
	}

	function renderPosts() {
		blogPostsContainer.innerHTML = '';

		const filteredPosts = filterPosts();
		const paginatedPosts = paginatePosts(filteredPosts);

		if (paginatedPosts.length === 0) {
			showNoResults();
			return;
		}

		paginatedPosts.forEach(post => {
			const postElement = createPostElement(post);
			blogPostsContainer.appendChild(postElement);
		});
	}

	function filterPosts() {
		return window.blogData.posts.filter(post => {
			// Filter by category
			const categoryMatch = !currentCategory ||
				post.categories.some(cat => cat.toLowerCase() === currentCategory.toLowerCase());

			// Filter by search term
			const searchMatch = !currentSearchTerm ||
				post.title.toLowerCase().includes(currentSearchTerm) ||
				post.excerpt.toLowerCase().includes(currentSearchTerm) ||
				post.content.toLowerCase().includes(currentSearchTerm) ||
				post.tags.some(tag => tag.toLowerCase().includes(currentSearchTerm)) ||
				post.categories.some(cat => cat.toLowerCase().includes(currentSearchTerm));

			return categoryMatch && searchMatch;
		});
	}

	function showNoResults() {
		blogPostsContainer.innerHTML = `
            <div class="col-span-full text-center py-12" data-aos="fade-up">
                <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-medium mb-2">No posts found</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
                <button onclick="resetFilters()" class="text-primary hover:text-secondary font-medium">
                    <i class="fas fa-undo mr-2"></i>Reset filters
                </button>
            </div>
        `;
	}

	function resetFilters() {
		currentSearchTerm = '';
		currentCategory = '';
		currentPage = 1;
		blogSearch.value = '';
		categoryFilter.value = '';
		renderPosts();
		renderPagination();
	}

	function paginatePosts(posts) {
		const startIndex = (currentPage - 1) * postsPerPage;
		return posts.slice(startIndex, startIndex + postsPerPage);
	}

	function createPostElement(post) {
		const postElement = document.createElement('article');
		postElement.className = 'bg-white dark:bg-dark/80 rounded-xl shadow-soft overflow-hidden hover:shadow-glow transition-all duration-300 border border-gray-100 dark:border-gray-800';
		postElement.setAttribute('data-aos', 'fade-up');

		postElement.innerHTML = `
            <a href="posts/${post.slug}.html">
                <div class="p-6">
                    <div class="flex flex-wrap gap-2 mb-3">
                        ${post.categories.map(category => `
                            <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        `).join('')}
                    </div>
                    <h3 class="text-xl font-semibold mb-2 hover:text-primary transition-colors">${post.title}</h3>
                    <p class="text-dark/70 dark:text-light/70 mb-4 line-clamp-2">${post.excerpt}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">${formatDate(post.date)} • ${post.readTime}</span>
                        <span class="text-primary text-sm font-medium">Read more →</span>
                    </div>
                </div>
            </a>
        `;

		return postElement;
	}

	function renderPagination() {
		paginationContainer.innerHTML = '';
		const filteredPosts = filterPosts();
		const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

		if (totalPages <= 1) return;

		// Previous button
		const prevButton = document.createElement('button');
		prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
		prevButton.className = `w-10 h-10 flex items-center justify-center rounded-full ${currentPage === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`;
		prevButton.disabled = currentPage === 1;
		prevButton.addEventListener('click', () => {
			if (currentPage > 1) {
				currentPage--;
				renderPosts();
				renderPagination();
				window.scrollTo({ top: blogPostsContainer.offsetTop - 100, behavior: 'smooth' });
			}
		});
		paginationContainer.appendChild(prevButton);

		// Page numbers
		const maxVisiblePages = 5;
		let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		if (startPage > 1) {
			const firstPageButton = document.createElement('button');
			firstPageButton.textContent = '1';
			firstPageButton.className = 'w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-dark/80 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary';
			firstPageButton.addEventListener('click', () => {
				currentPage = 1;
				renderPosts();
				renderPagination();
				window.scrollTo({ top: blogPostsContainer.offsetTop - 100, behavior: 'smooth' });
			});
			paginationContainer.appendChild(firstPageButton);

			if (startPage > 2) {
				const ellipsis = document.createElement('span');
				ellipsis.className = 'w-10 h-10 flex items-center justify-center';
				ellipsis.textContent = '...';
				paginationContainer.appendChild(ellipsis);
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			const pageButton = document.createElement('button');
			pageButton.textContent = i;
			pageButton.className = `w-10 h-10 flex items-center justify-center rounded-full ${currentPage === i ? 'bg-primary text-white' : 'bg-white dark:bg-dark/80 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary'}`;
			pageButton.addEventListener('click', () => {
				currentPage = i;
				renderPosts();
				renderPagination();
				window.scrollTo({ top: blogPostsContainer.offsetTop - 100, behavior: 'smooth' });
			});
			paginationContainer.appendChild(pageButton);
		}

		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				const ellipsis = document.createElement('span');
				ellipsis.className = 'w-10 h-10 flex items-center justify-center';
				ellipsis.textContent = '...';
				paginationContainer.appendChild(ellipsis);
			}

			const lastPageButton = document.createElement('button');
			lastPageButton.textContent = totalPages;
			lastPageButton.className = 'w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-dark/80 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary';
			lastPageButton.addEventListener('click', () => {
				currentPage = totalPages;
				renderPosts();
				renderPagination();
				window.scrollTo({ top: blogPostsContainer.offsetTop - 100, behavior: 'smooth' });
			});
			paginationContainer.appendChild(lastPageButton);
		}

		// Next button
		const nextButton = document.createElement('button');
		nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
		nextButton.className = `w-10 h-10 flex items-center justify-center rounded-full ${currentPage === totalPages ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`;
		nextButton.disabled = currentPage === totalPages;
		nextButton.addEventListener('click', () => {
			if (currentPage < totalPages) {
				currentPage++;
				renderPosts();
				renderPagination();
				window.scrollTo({ top: blogPostsContainer.offsetTop - 100, behavior: 'smooth' });
			}
		});
		paginationContainer.appendChild(nextButton);
	}

	// Helper functions
	function formatDate(dateString) {
		const options = { year: 'numeric', month: 'short', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('en-US', options);
	}

	function debounce(func, wait) {
		let timeout;
		return function(...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	// Make resetFilters available globally
	window.resetFilters = resetFilters;
});

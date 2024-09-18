document.addEventListener('DOMContentLoaded', () => {
    // Creating blog
    const form = document.getElementById('blogForm');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;

            if (!title || !content) {
                alert('Title and content are required!');
                return;
            }

            const formAction = form.getAttribute('action') || '/blogposts';
            const method = form.dataset.method || 'POST';
            try {
                const response = await fetch(formAction, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('accessToken')}`
                    },
                    body: JSON.stringify({ title, body: content })
                });

                console.log(response);
                if (response.ok) {
                    const result = await response.json();
                    alert(method === 'POST' ? 'Blog created successfully!' : ' Blog updated successfully!');

                    form.reset();
                    window.location.href = '/home';
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (err) {
                console.error('Error:', err);
                alert('An error occurred. Please try again.');
            }
        });
    }
    const userForm = document.getElementById('blogUserForm');
    
    if (userForm) {
        userForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;

            if (!title || !content) {
                alert('Title and content are required!');
                return;
            }

            const formAction = userForm.getAttribute('action');

            try {
                const response = await fetch(formAction, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('accessToken')}`
                    },
                    body: JSON.stringify({ title, body: content })
                });

                if (response.ok) {
                    alert('Blog updated successfully!');
                    userForm.reset();
                    window.location.href = '/admin/adminHome';
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (err) {
                console.error('Error:', err);
                alert('An error occurred. Please try again.');
            }
        });
    }


    // Editing blog posts
    const editButtons = document.querySelectorAll('.editButton');
    editButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const postId = event.target.getAttribute('data-id');
            const newTitle = prompt("Enter new title:");
            const newContent = prompt("Enter new content:");

            if (newTitle && newContent) {
                try {
                    const response = await fetch(`/blogs/${postId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getCookie('accessToken')}`
                        },
                        body: JSON.stringify({ title: newTitle, body: newContent })
                    });

                    if (response.ok) {
                        alert('Blog updated successfully!');
                        window.location.reload();
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message}`);
                    }
                } catch (err) {
                    console.error('Error:', err);
                    alert('An error occurred. Please try again.');
                }
            } else {
                alert('Title and content are required!');
            }
        });
    });

    // Deleting users
    const deleteUserButton = document.getElementById('deleteUserButton');
    if (deleteUserButton) {
        deleteUserButton.addEventListener('click', async (event) => {
            const userId = deleteUserButton.getAttribute('data-id');
            console.log('User ID:', userId);

            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    const response = await fetch(`/admin/delete/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getCookie('accessToken')}`
                        }
                    });

                    if (response.ok) {
                        alert('User deleted successfully!');
                        window.location.href = '/admin/adminHome';
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message}`);
                    }
                } catch (err) {
                    console.error('Error:', err);
                    alert('An error occurred. Please try again.');
                }
            }
        });
    }
    // Deleting posts
    const deleteButtons = document.getElementsByClassName('deleteButton');

    Array.from(deleteButtons).forEach(button => {
        button.addEventListener('click', async (event) => {
            const postId = event.target.getAttribute('post-id');
            if (confirm('Are you sure you want to delete this post?')) {
                try {
                    const response = await fetch(`/blogposts/${postId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${getCookie('accessToken')}`
                        }
                    });

                    if (response.ok) {
                        alert('Post deleted successfully!');
                        location.reload();
                    } else {
                        const text = await response.text();
                        alert(`Error: ${text}`);
                    }
                } catch (err) {
                    console.error('Error:', err);
                    alert('An error occurred. Please try again.');
                }
            }
        });
    });

    // Admin login
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/admin/adminLogin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Login successful');
                    window.location.href = '/admin/adminHome';
                } else {
                    const text = await response.text();
                    console.error('Response Error:', text);
                    alert('Error: ' + (text || 'An unexpected error occurred'));
                }
            } catch (error) {
                alert('Error:User is not Authorized to log into this page');
            }
        });
    }

    // Create blog button
    const createBlogBtn = document.getElementById('create_blog_btn');
    if (createBlogBtn) {
        createBlogBtn.addEventListener('click', function () {
            window.location.href = '/blogs';
        });
    }

});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var cards = document.querySelectorAll('.card');


cards.forEach(card => {
    card.addEventListener('click', function () {
        var title = this.querySelector('h3').innerText;
        var body = this.querySelector('p').innerText;
        var user = this.querySelector('.username').innerText;

        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalBody').innerText = body;
        document.getElementById('modalUser').innerText = user;

        modal.style.display = "block";
    });
});

span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

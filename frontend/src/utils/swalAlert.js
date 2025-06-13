import Swal from 'sweetalert2';

const swalAlert = (title, text, icon = 'success', timer = 1500, confirmButtonText = 'OK') => {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText,
        confirmButtonColor: icon === 'success' ? '#3085d6' : '#d33',
        background: '#1a1a1a',
        color: '#ffffff',
        customClass: {
            popup: 'dark-theme-popup',
            title: 'dark-theme-title',
            content: 'dark-theme-content',
            confirmButton: 'dark-theme-button'
        },
        timer
    });
};

export default swalAlert; 
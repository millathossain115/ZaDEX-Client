// All 64 districts of Bangladesh with coordinates and service center counts
const districtsData = [
    // Barishal Division
    { name: 'Barguna', lat: 22.1510, lng: 90.1266, centers: 2, division: 'Barishal' },
    { name: 'Barishal', lat: 22.7010, lng: 90.3535, centers: 5, division: 'Barishal' },
    { name: 'Bhola', lat: 22.6859, lng: 90.6482, centers: 2, division: 'Barishal' },
    { name: 'Jhalokati', lat: 22.6406, lng: 90.1987, centers: 1, division: 'Barishal' },
    { name: 'Patuakhali', lat: 22.3596, lng: 90.3290, centers: 3, division: 'Barishal' },
    { name: 'Pirojpur', lat: 22.5791, lng: 89.9759, centers: 2, division: 'Barishal' },

    // Chattogram Division
    { name: 'Bandarban', lat: 22.1953, lng: 92.2184, centers: 1, division: 'Chattogram' },
    { name: 'Brahmanbaria', lat: 23.9571, lng: 91.1112, centers: 4, division: 'Chattogram' },
    { name: 'Chandpur', lat: 23.2332, lng: 90.6712, centers: 3, division: 'Chattogram' },
    { name: 'Chattogram', lat: 22.3569, lng: 91.7832, centers: 12, division: 'Chattogram' },
    { name: 'Cumilla', lat: 23.4607, lng: 91.1809, centers: 6, division: 'Chattogram' },
    { name: "Cox's Bazar", lat: 21.4272, lng: 92.0058, centers: 4, division: 'Chattogram' },
    { name: 'Feni', lat: 23.0159, lng: 91.3976, centers: 3, division: 'Chattogram' },
    { name: 'Khagrachhari', lat: 23.1193, lng: 91.9847, centers: 1, division: 'Chattogram' },
    { name: 'Lakshmipur', lat: 22.9447, lng: 90.8282, centers: 2, division: 'Chattogram' },
    { name: 'Noakhali', lat: 22.8696, lng: 91.0995, centers: 3, division: 'Chattogram' },
    { name: 'Rangamati', lat: 22.6372, lng: 92.1802, centers: 1, division: 'Chattogram' },

    // Dhaka Division
    { name: 'Dhaka', lat: 23.8103, lng: 90.4125, centers: 18, division: 'Dhaka' },
    { name: 'Faridpur', lat: 23.6070, lng: 89.8429, centers: 4, division: 'Dhaka' },
    { name: 'Gazipur', lat: 23.9999, lng: 90.4203, centers: 8, division: 'Dhaka' },
    { name: 'Gopalganj', lat: 23.0051, lng: 89.8266, centers: 2, division: 'Dhaka' },
    { name: 'Kishoreganj', lat: 24.4449, lng: 90.7766, centers: 3, division: 'Dhaka' },
    { name: 'Madaripur', lat: 23.1641, lng: 90.1897, centers: 2, division: 'Dhaka' },
    { name: 'Manikganj', lat: 23.8617, lng: 90.0003, centers: 3, division: 'Dhaka' },
    { name: 'Munshiganj', lat: 23.5422, lng: 90.5305, centers: 3, division: 'Dhaka' },
    { name: 'Narayanganj', lat: 23.6238, lng: 90.5000, centers: 7, division: 'Dhaka' },
    { name: 'Narsingdi', lat: 23.9322, lng: 90.7151, centers: 3, division: 'Dhaka' },
    { name: 'Rajbari', lat: 23.7574, lng: 89.6445, centers: 2, division: 'Dhaka' },
    { name: 'Shariatpur', lat: 23.2423, lng: 90.4348, centers: 2, division: 'Dhaka' },
    { name: 'Tangail', lat: 24.2513, lng: 89.9167, centers: 4, division: 'Dhaka' },

    // Khulna Division
    { name: 'Bagerhat', lat: 22.6513, lng: 89.7898, centers: 2, division: 'Khulna' },
    { name: 'Chuadanga', lat: 23.6401, lng: 88.8420, centers: 2, division: 'Khulna' },
    { name: 'Jashore', lat: 23.1665, lng: 89.2134, centers: 4, division: 'Khulna' },
    { name: 'Jhenaidah', lat: 23.5448, lng: 89.1539, centers: 2, division: 'Khulna' },
    { name: 'Khulna', lat: 22.8456, lng: 89.5403, centers: 8, division: 'Khulna' },
    { name: 'Kushtia', lat: 23.9013, lng: 89.1200, centers: 3, division: 'Khulna' },
    { name: 'Magura', lat: 23.4873, lng: 89.4198, centers: 2, division: 'Khulna' },
    { name: 'Meherpur', lat: 23.7622, lng: 88.6318, centers: 1, division: 'Khulna' },
    { name: 'Narail', lat: 23.1725, lng: 89.4951, centers: 2, division: 'Khulna' },
    { name: 'Satkhira', lat: 22.7185, lng: 89.0714, centers: 3, division: 'Khulna' },

    // Mymensingh Division
    { name: 'Jamalpur', lat: 24.9375, lng: 89.9372, centers: 3, division: 'Mymensingh' },
    { name: 'Mymensingh', lat: 24.7471, lng: 90.4203, centers: 5, division: 'Mymensingh' },
    { name: 'Netrokona', lat: 24.8706, lng: 90.7279, centers: 2, division: 'Mymensingh' },
    { name: 'Sherpur', lat: 25.0204, lng: 90.0153, centers: 2, division: 'Mymensingh' },

    // Rajshahi Division
    { name: 'Bogura', lat: 24.8465, lng: 89.3773, centers: 5, division: 'Rajshahi' },
    { name: 'Chapai Nawabganj', lat: 24.5965, lng: 88.2776, centers: 2, division: 'Rajshahi' },
    { name: 'Joypurhat', lat: 25.0953, lng: 89.0180, centers: 2, division: 'Rajshahi' },
    { name: 'Naogaon', lat: 24.7936, lng: 88.9318, centers: 3, division: 'Rajshahi' },
    { name: 'Natore', lat: 24.4206, lng: 89.0000, centers: 2, division: 'Rajshahi' },
    { name: 'Pabna', lat: 24.0064, lng: 89.2372, centers: 3, division: 'Rajshahi' },
    { name: 'Rajshahi', lat: 24.3745, lng: 88.6042, centers: 7, division: 'Rajshahi' },
    { name: 'Sirajganj', lat: 24.4534, lng: 89.7007, centers: 3, division: 'Rajshahi' },

    // Rangpur Division
    { name: 'Dinajpur', lat: 25.6217, lng: 88.6354, centers: 4, division: 'Rangpur' },
    { name: 'Gaibandha', lat: 25.3288, lng: 89.5285, centers: 2, division: 'Rangpur' },
    { name: 'Kurigram', lat: 25.8072, lng: 89.6295, centers: 2, division: 'Rangpur' },
    { name: 'Lalmonirhat', lat: 25.9185, lng: 89.4508, centers: 2, division: 'Rangpur' },
    { name: 'Nilphamari', lat: 25.9316, lng: 88.8560, centers: 2, division: 'Rangpur' },
    { name: 'Panchagarh', lat: 26.3411, lng: 88.5542, centers: 1, division: 'Rangpur' },
    { name: 'Rangpur', lat: 25.7439, lng: 89.2752, centers: 6, division: 'Rangpur' },
    { name: 'Thakurgaon', lat: 26.0336, lng: 88.4616, centers: 2, division: 'Rangpur' },

    // Sylhet Division
    { name: 'Habiganj', lat: 24.3840, lng: 91.4117, centers: 3, division: 'Sylhet' },
    { name: 'Moulvibazar', lat: 24.4829, lng: 91.7774, centers: 2, division: 'Sylhet' },
    { name: 'Sunamganj', lat: 25.0658, lng: 91.3950, centers: 2, division: 'Sylhet' },
    { name: 'Sylhet', lat: 24.8949, lng: 91.8687, centers: 7, division: 'Sylhet' },
];

export default districtsData;

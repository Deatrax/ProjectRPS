const API_URL = 'http://localhost:5000/api/achievements';

const getAchievements = async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch achievements');
    }

    return await response.json();
};

export default {
    getAchievements
};

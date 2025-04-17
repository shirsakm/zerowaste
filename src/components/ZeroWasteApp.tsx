import { useState, useEffect } from 'react'
import { User, Shield, Heart, Search, Package, MapPin, Calendar, Info } from "lucide-react"

type UserRole = 'donor' | 'receiver' | 'ngo' | null
type FoodCategory = 'fruits' | 'vegetables' | 'dairy' | 'bakery' | 'meals' | 'other'

interface FoodItem {
    id: string
    title: string
    description: string
    category: FoodCategory
    quantity: string
    expiryDate: string
    location: string
    postedBy: string
    postedAt: Date
}

interface UserProfile {
    name: string
    role: UserRole
    description: string
    contact: string
}

export default function ZeroWasteApp() {
    // Authentication state
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all')
    const [activeTab, setActiveTab] = useState('listings')

    // Form state
    const [newFoodItem, setNewFoodItem] = useState({
        title: '',
        description: '',
        category: 'fruits' as FoodCategory,
        quantity: '',
        expiryDate: '',
        location: ''
    })

    // Food items state with localStorage persistence
    const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
        // Initialize from localStorage if available
        if (typeof window !== 'undefined') {
            const savedItems = localStorage.getItem('foodItems')
            return savedItems ? JSON.parse(savedItems) : [
                {
                    id: '1',
                    title: 'Fresh Apples',
                    description: 'Box of organic apples, slightly bruised but perfectly good',
                    category: 'fruits',
                    quantity: '5 kg',
                    expiryDate: '2023-12-15',
                    location: 'Downtown Market',
                    postedBy: 'Local Grocer',
                    postedAt: new Date()
                },
                {
                    id: '2',
                    title: 'Day-old Bread',
                    description: 'Assorted bakery items from yesterday',
                    category: 'bakery',
                    quantity: '10 loaves',
                    expiryDate: '2023-12-10',
                    location: 'Main Street Bakery',
                    postedBy: 'Community Kitchen',
                    postedAt: new Date()
                }
            ]
        }
        return []
    })

    // Persist food items to localStorage when they change
    useEffect(() => {
        localStorage.setItem('foodItems', JSON.stringify(foodItems))
    }, [foodItems])

    const handleLogin = (role: UserRole) => {
        setCurrentUser({
            name: role === 'donor' ? 'Food Donor' :
                role === 'receiver' ? 'Food Receiver' : 'Local NGO',
            role,
            description: role === 'donor' ? 'Restaurant owner donating excess food' :
                role === 'receiver' ? 'Community center feeding those in need' :
                    'Non-profit organization redistributing food',
            contact: 'contact@example.com'
        })
    }

    const handleLogout = () => {
        setCurrentUser(null)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewFoodItem(prev => ({ ...prev, [name]: value }))
    }

    const handleCategoryChange = (value: FoodCategory) => {
        setNewFoodItem(prev => ({ ...prev, category: value }))
    }

    const handleSubmitFoodItem = (e: React.FormEvent) => {
        e.preventDefault()
        const newItem: FoodItem = {
            id: Date.now().toString(),
            ...newFoodItem,
            postedBy: currentUser?.name || 'Anonymous',
            postedAt: new Date()
        }
        setFoodItems([...foodItems, newItem])
        setNewFoodItem({
            title: '',
            description: '',
            category: 'fruits',
            quantity: '',
            expiryDate: '',
            location: ''
        })
        // Switch to listings tab after successful submission
        setActiveTab('listings')
    }

    const filteredItems = foodItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const getCategoryIcon = (category: FoodCategory) => {
        switch (category) {
            case 'fruits': return '🍎';
            case 'vegetables': return '🥦';
            case 'dairy': return '🥛';
            case 'bakery': return '🥖';
            case 'meals': return '🍲';
            default: return '📦';
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* App Header */}
            <header className="bg-white shadow-sm py-4 px-6">
                <div className="flex justify-between items-center max-w-lg mx-auto">
                    <div className="flex items-center gap-2">
                        <Heart className="text-green-600 w-5 h-5" />
                        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            ZeroWaste
                        </h1>
                    </div>

                    {currentUser && (
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 flex items-center gap-1 text-sm"
                        >
                            <span>Logout</span>
                        </button>
                    )}
                </div>
            </header>

            <main className="max-w-lg mx-auto px-4 pb-24">
                {currentUser ? (
                    <div>
                        {/* User Welcome Bar */}
                        <div className="mt-4 mb-6 text-center">
                            <p className="text-gray-600">
                                Hello, <span className="font-medium">{currentUser.name}</span>
                            </p>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex justify-around mb-6 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('listings')}
                                className={`pb-2 px-4 text-base font-medium transition-colors ${activeTab === 'listings'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-gray-500'
                                    }`}
                            >
                                Food Listings
                            </button>
                            {currentUser.role !== 'receiver' && (
                                <button
                                    onClick={() => setActiveTab('post')}
                                    className={`pb-2 px-4 text-base font-medium transition-colors ${activeTab === 'post'
                                            ? 'text-green-600 border-b-2 border-green-600'
                                            : 'text-gray-500'
                                        }`}
                                >
                                    Post Food
                                </button>
                            )}
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`pb-2 px-4 text-base font-medium transition-colors ${activeTab === 'profile'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-gray-500'
                                    }`}
                            >
                                Profile
                            </button>
                        </div>

                        {/* Content Areas */}
                        {activeTab === 'listings' && (
                            <div className="space-y-6">
                                {/* Search & Filter */}
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search food items..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                                        />
                                    </div>

                                    {/* Category Filter Pills */}
                                    <div className="flex overflow-x-auto py-2 gap-2 no-scrollbar">
                                        <button
                                            onClick={() => setSelectedCategory('all')}
                                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${selectedCategory === 'all'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-white text-gray-700 border border-gray-200'
                                                }`}
                                        >
                                            All Items
                                        </button>
                                        {(['fruits', 'vegetables', 'dairy', 'bakery', 'meals', 'other'] as FoodCategory[]).map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${selectedCategory === category
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-white text-gray-700 border border-gray-200'
                                                    }`}
                                            >
                                                {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Food Listings */}
                                {filteredItems.length === 0 ? (
                                    <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                                        <Info className="mx-auto mb-3 text-gray-400 w-8 h-8" />
                                        <p className="text-gray-600">No food items found matching your criteria</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredItems.map(item => (
                                            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                                <div className="p-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                                                            {getCategoryIcon(item.category)} {item.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 mb-4">{item.description}</p>

                                                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                                                        <div className="flex items-center gap-1.5">
                                                            <Package className="w-4 h-4 text-gray-500" />
                                                            <span>{item.quantity}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4 text-gray-500" />
                                                            <span>Expires: {item.expiryDate}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 col-span-2">
                                                            <MapPin className="w-4 h-4 text-gray-500" />
                                                            <span>{item.location}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-gray-50 border-t border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500">Posted by: {item.postedBy}</span>
                                                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                                            Claim Food
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'post' && (
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h2 className="text-xl font-semibold mb-1 text-gray-800">Post New Food Item</h2>
                                <p className="text-gray-500 text-sm mb-6">Share details about the food you'd like to donate</p>

                                <form onSubmit={handleSubmitFoodItem} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                                            Food Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            placeholder="What are you donating?"
                                            value={newFoodItem.title}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={3}
                                            placeholder="Provide details about the food"
                                            value={newFoodItem.description}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category
                                        </label>
                                        <select
                                            value={newFoodItem.category}
                                            onChange={(e) => handleCategoryChange(e.target.value as FoodCategory)}
                                            className="w-full p-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                                        >
                                            <option value="fruits">{getCategoryIcon('fruits')} Fruits</option>
                                            <option value="vegetables">{getCategoryIcon('vegetables')} Vegetables</option>
                                            <option value="dairy">{getCategoryIcon('dairy')} Dairy</option>
                                            <option value="bakery">{getCategoryIcon('bakery')} Bakery</option>
                                            <option value="meals">{getCategoryIcon('meals')} Prepared Meals</option>
                                            <option value="other">{getCategoryIcon('other')} Other</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
                                                Quantity
                                            </label>
                                            <input
                                                type="text"
                                                id="quantity"
                                                name="quantity"
                                                placeholder="Amount"
                                                value={newFoodItem.quantity}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full p-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expiryDate">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="date"
                                                id="expiryDate"
                                                name="expiryDate"
                                                value={newFoodItem.expiryDate}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full p-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
                                            Pickup Location
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            placeholder="Where can this be picked up?"
                                            value={newFoodItem.location}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-3 rounded-xl bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-colors"
                                    >
                                        Post Food Item
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-center mb-6">
                                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                                        {currentUser.role === 'donor' && <User className="w-10 h-10 text-green-600" />}
                                        {currentUser.role === 'receiver' && <User className="w-10 h-10 text-green-600" />}
                                        {currentUser.role === 'ngo' && <Shield className="w-10 h-10 text-green-600" />}
                                    </div>
                                </div>
                                <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Your Profile</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Role</h3>
                                        <p className="mt-1 text-gray-800 capitalize font-medium">{currentUser.role}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                        <p className="mt-1 text-gray-800">{currentUser.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                                        <p className="mt-1 text-gray-800">{currentUser.contact}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-6">
                            <Heart className="w-16 h-16 mx-auto text-green-500 mb-4" />
                            <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                Welcome to ZeroWaste
                            </h1>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Connect with your community to reduce food waste and help those in need
                            </p>
                        </div>

                        <div className="space-y-3 w-full max-w-xs">
                            <button
                                onClick={() => handleLogin('donor')}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-xl shadow-sm transition-colors flex items-center justify-center"
                            >
                                <User className="w-5 h-5 mr-2" />
                                I want to donate food
                            </button>

                            <button
                                onClick={() => handleLogin('receiver')}
                                className="w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-yellow-400 font-medium py-3 px-6 rounded-xl shadow-sm transition-colors flex items-center justify-center"
                            >
                                <User className="w-5 h-5 mr-2" />
                                I need food assistance
                            </button>

                            <button
                                onClick={() => handleLogin('ngo')}
                                className="w-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 py-3 px-6 rounded-xl shadow-sm transition-colors flex items-center justify-center"
                            >
                                <Shield className="w-5 h-5 mr-2" />
                                I represent an NGO
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Mobile Bottom Navigation */}
            {currentUser && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
                    <div className="flex justify-around max-w-lg mx-auto">
                        <button
                            onClick={() => setActiveTab('listings')}
                            className={`flex flex-col items-center p-2 ${activeTab === 'listings' ? 'text-green-600' : 'text-gray-500'
                                }`}
                        >
                            <Package className="w-6 h-6" />
                            <span className="text-xs mt-1">Listings</span>
                        </button>

                        {currentUser.role !== 'receiver' && (
                            <button
                                onClick={() => setActiveTab('post')}
                                className={`flex flex-col items-center p-2 ${activeTab === 'post' ? 'text-green-600' : 'text-gray-500'
                                    }`}
                            >
                                <Heart className="w-6 h-6" />
                                <span className="text-xs mt-1">Donate</span>
                            </button>
                        )}

                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-green-600' : 'text-gray-500'
                                }`}
                        >
                            <User className="w-6 h-6" />
                            <span className="text-xs mt-1">Profile</span>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    )
}
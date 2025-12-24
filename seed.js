const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Product Schema (sama seperti di server.js)
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: { type: String, enum: ['masculine', 'feminine', 'unisex'], default: 'unisex' },
    stock: { type: Number, default: 0, min: 0 },
    fragrance_notes: {
        top: [String],
        middle: [String],
        base: [String]
    },
    featured: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Data produk awal sesuai dengan website
const initialProducts = [
    {
        name: "Blue Night",
        description: "Kombinasi aroma fresh, aromatic, cool yang sempurna untuk menemani malam Anda. Memberikan kesan elegan dan misterius.",
        price: 150000,
        image: "BLUE NIGHT.jpg",
        category: "masculine",
        stock: 50,
        fragrance_notes: {
            top: ["Bergamot", "Lemon", "Mint"],
            middle: ["Lavender", "Geranium", "Marine"],
            base: ["Cedar", "Amber", "Musk"]
        },
        featured: true
    },
    {
        name: "Cool Man",
        description: "Kombinasi Elegant & Maskulin yang mencerminkan kepribadian pria modern. Tahan lama sepanjang hari.",
        price: 175000,
        image: "COOLMAN.jpg",
        category: "masculine",
        stock: 45,
        fragrance_notes: {
            top: ["Grapefruit", "Black Pepper", "Cardamom"],
            middle: ["Vetiver", "Patchouli", "Iris"],
            base: ["Cedarwood", "Tonka Bean", "Amber"]
        },
        featured: true
    },
    {
        name: "Lucky",
        description: "Kombinasi Segar, Elegant, Kalem, Cool. Aroma yang membawa keberuntungan dan kepercayaan diri dalam setiap langkah.",
        price: 165000,
        image: "LUCKY.jpg",
        category: "unisex",
        stock: 60,
        fragrance_notes: {
            top: ["Mandarin", "Hazelnut", "Clover"],
            middle: ["Orange Blossom", "Jasmine", "Peach"],
            base: ["Sandalwood", "Vanilla", "Vetiver"]
        },
        featured: true
    },
    {
        name: "Pinkfon",
        description: "Kombinasi Aroma feminim dan manis yang memikat. Sempurna untuk wanita yang percaya diri dan anggun.",
        price: 155000,
        image: "PINKFON.jpg",
        category: "feminine",
        stock: 55,
        fragrance_notes: {
            top: ["Raspberry", "Pear", "Pink Pepper"],
            middle: ["Rose", "Peony", "Magnolia"],
            base: ["Vanilla", "Patchouli", "Musk"]
        },
        featured: true
    }
];

// Fungsi untuk seed database
async function seedDatabase() {
    try {
        // Connect ke MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aens_perfume', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connected to MongoDB');
        
        // Hapus data lama
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');
        
        // Insert data baru
        await Product.insertMany(initialProducts);
        console.log('✨ Seeded database with initial products');
        
        // Tampilkan hasil
        const products = await Product.find({});
        console.log(`\n📦 Total products in database: ${products.length}\n`);
        products.forEach(p => {
            console.log(`- ${p.name} (${p.category}) - Rp ${p.price.toLocaleString('id-ID')}`);
        });
        
        console.log('\n✅ Database seeding completed!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Jalankan seeder
seedDatabase();
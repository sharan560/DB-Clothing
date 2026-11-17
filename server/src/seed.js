require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Category = require('./models/Category');
const Collection = require('./models/Collection');
const Product = require('./models/Product');
const HomepageContent = require('./models/HomepageContent');

// High-quality Unsplash fashion images (free to use)
const UNSPLASH = {
  hero1: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&q=80',
  hero2: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
  tshirt1: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
  tshirt2: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
  shirt1: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
  shirt2: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
  jeans1: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
  jeans2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  trouser1: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
  cat_tshirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  cat_shirts: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
  cat_jeans: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
  cat_casual: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  col_new: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
  col_best: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
};

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Collection.deleteMany({}),
    Product.deleteMany({}),
    HomepageContent.deleteMany({}),
  ]);
  console.log('🧹 Cleared existing data');

  // ── Users ──────────────────────────────────────────────────
  const adminUser = await User.create({
    name: 'DB Admin',
    email: process.env.ADMIN_EMAIL || 'admin@dbclothing.in',
    password: process.env.ADMIN_PASSWORD || 'Admin@1234',
    role: 'admin',
    isEmailVerified: true,
  });
  console.log(`👤 Admin created: ${adminUser.email}`);

  // ── Categories ────────────────────────────────────────────
  const categories = await Category.insertMany([
    { name: 'T-Shirts', slug: 't-shirts', description: 'Premium everyday tees', image: UNSPLASH.cat_tshirt, order: 1 },
    { name: 'Shirts', slug: 'shirts', description: 'Clean casual & formal shirts', image: UNSPLASH.cat_shirts, order: 2 },
    { name: 'Jeans', slug: 'jeans', description: 'Slim, straight & relaxed fits', image: UNSPLASH.cat_jeans, order: 3 },
    { name: 'Trousers', slug: 'trousers', description: 'Everyday essentials', image: UNSPLASH.cat_casual, order: 4 },
    { name: 'Casualwear', slug: 'casualwear', description: 'Laid-back style', image: UNSPLASH.cat_casual, order: 5 },
  ]);
  console.log(`📂 ${categories.length} categories created`);

  const [catTshirts, catShirts, catJeans, catTrousers, catCasual] = categories;

  // ── Collections ────────────────────────────────────────────
  const collections = await Collection.insertMany([
    { name: 'New Arrivals', slug: 'new-arrivals', type: 'new-arrivals', image: UNSPLASH.col_new, isFeatured: true, badge: 'NEW', order: 1 },
    { name: 'Bestsellers', slug: 'bestsellers', type: 'bestsellers', image: UNSPLASH.col_best, isFeatured: true, badge: 'HOT', order: 2 },
    { name: 'Everyday Essentials', slug: 'everyday-essentials', type: 'featured', image: UNSPLASH.col_new, order: 3 },
    { name: 'Sale', slug: 'sale', type: 'sale', image: UNSPLASH.col_best, isFeatured: true, badge: 'SALE', order: 4 },
  ]);
  const [colNew, colBest, colEssentials, colSale] = collections;
  console.log(`🗂️ ${collections.length} collections created`);

  // ── Products ──────────────────────────────────────────────
  const productData = [
    {
      name: 'Classic White Oversized Tee',
      slug: 'classic-white-oversized-tee',
      description: 'Our signature oversized tee in a premium 240GSM cotton. Cut for a relaxed, editorial drape — wear it tucked or loose. A wardrobe foundation piece.',
      material: '100% Premium Ring-Spun Cotton, 240GSM',
      care: 'Machine wash cold. Tumble dry low. Do not bleach.',
      basePrice: 799,
      originalPrice: 1199,
      images: [
        { url: UNSPLASH.tshirt1, alt: 'Classic White Oversized Tee front', order: 0 },
        { url: UNSPLASH.tshirt2, alt: 'Classic White Oversized Tee detail', order: 1 },
      ],
      variants: [
        { size: 'S', color: 'White', colorHex: '#FFFFFF', sku: 'DB-WT-OS-S', stock: 25 },
        { size: 'M', color: 'White', colorHex: '#FFFFFF', sku: 'DB-WT-OS-M', stock: 40 },
        { size: 'L', color: 'White', colorHex: '#FFFFFF', sku: 'DB-WT-OS-L', stock: 35 },
        { size: 'XL', color: 'White', colorHex: '#FFFFFF', sku: 'DB-WT-OS-XL', stock: 20 },
        { size: 'S', color: 'Black', colorHex: '#1A1917', sku: 'DB-BK-OS-S', stock: 30 },
        { size: 'M', color: 'Black', colorHex: '#1A1917', sku: 'DB-BK-OS-M', stock: 45 },
        { size: 'L', color: 'Black', colorHex: '#1A1917', sku: 'DB-BK-OS-L', stock: 40 },
        { size: 'XL', color: 'Black', colorHex: '#1A1917', sku: 'DB-BK-OS-XL', stock: 25 },
      ],
      category: catTshirts._id,
      collections: [colNew._id, colBest._id],
      tags: ['tshirt', 'oversized', 'cotton', 'white', 'black', 'casual'],
      isNewArrival: true, isFeatured: true, isBestseller: true,
      fit: 'Oversized', occasion: ['Casual', 'Everyday'],
      seoTitle: 'Classic White Oversized Tee | DB Clothing',
      seoDescription: 'Premium 240GSM cotton oversized tee. Shop the DB Clothing signature tee in White & Black.',
    },
    {
      name: 'Charcoal Drop-Shoulder Tee',
      slug: 'charcoal-drop-shoulder-tee',
      description: 'A structured drop-shoulder tee in charcoal melange. The heavy-weight fabric gives a premium hand-feel and a clean silhouette that photographs beautifully.',
      material: '100% Cotton, 260GSM, Melange',
      care: 'Machine wash cold. Lay flat to dry.',
      basePrice: 899,
      images: [
        { url: UNSPLASH.tshirt2, alt: 'Charcoal Drop Shoulder Tee', order: 0 },
        { url: UNSPLASH.tshirt1, alt: 'Detail view', order: 1 },
      ],
      variants: [
        { size: 'S', color: 'Charcoal', colorHex: '#2C2A27', sku: 'DB-CH-DS-S', stock: 20 },
        { size: 'M', color: 'Charcoal', colorHex: '#2C2A27', sku: 'DB-CH-DS-M', stock: 35 },
        { size: 'L', color: 'Charcoal', colorHex: '#2C2A27', sku: 'DB-CH-DS-L', stock: 30 },
        { size: 'XL', color: 'Charcoal', colorHex: '#2C2A27', sku: 'DB-CH-DS-XL', stock: 15 },
      ],
      category: catTshirts._id,
      collections: [colNew._id],
      tags: ['tshirt', 'drop-shoulder', 'charcoal', 'premium'],
      isNewArrival: true, isFeatured: true,
      fit: 'Oversized',
    },
    {
      name: 'Linen Blend Summer Shirt',
      slug: 'linen-blend-summer-shirt',
      description: 'Our bestselling summer shirt in a breathable linen-cotton blend. A relaxed, slightly oversized cut with a camp collar. Perfect for Indian summers.',
      material: '55% Linen, 45% Cotton',
      care: 'Machine wash cold, gentle cycle. Iron on medium.',
      basePrice: 1499,
      originalPrice: 1999,
      images: [
        { url: UNSPLASH.shirt1, alt: 'Linen Summer Shirt front', order: 0 },
        { url: UNSPLASH.shirt2, alt: 'Linen Summer Shirt worn', order: 1 },
      ],
      variants: [
        { size: 'S', color: 'Off White', colorHex: '#FAF9F7', sku: 'DB-LN-OW-S', stock: 15 },
        { size: 'M', color: 'Off White', colorHex: '#FAF9F7', sku: 'DB-LN-OW-M', stock: 25 },
        { size: 'L', color: 'Off White', colorHex: '#FAF9F7', sku: 'DB-LN-OW-L', stock: 20 },
        { size: 'XL', color: 'Off White', colorHex: '#FAF9F7', sku: 'DB-LN-OW-XL', stock: 10 },
        { size: 'S', color: 'Sage', colorHex: '#87A896', sku: 'DB-LN-SG-S', stock: 12 },
        { size: 'M', color: 'Sage', colorHex: '#87A896', sku: 'DB-LN-SG-M', stock: 20 },
        { size: 'L', color: 'Sage', colorHex: '#87A896', sku: 'DB-LN-SG-L', stock: 18 },
      ],
      category: catShirts._id,
      collections: [colBest._id, colEssentials._id],
      tags: ['shirt', 'linen', 'summer', 'camp collar', 'casual'],
      isBestseller: true, isFeatured: true,
      fit: 'Relaxed', occasion: ['Casual', 'Beach', 'Summer'],
    },
    {
      name: 'Slim Fit Dark Wash Jeans',
      slug: 'slim-fit-dark-wash-jeans',
      description: 'Premium dark indigo denim with subtle stretch for comfort. A contemporary slim silhouette that works with everything — tees, shirts, or kurtas.',
      material: '98% Cotton, 2% Elastane, 12oz Denim',
      care: 'Machine wash cold, inside out. Line dry.',
      basePrice: 1999,
      originalPrice: 2799,
      images: [
        { url: UNSPLASH.jeans1, alt: 'Dark Wash Slim Jeans', order: 0 },
        { url: UNSPLASH.jeans2, alt: 'Jeans detail', order: 1 },
      ],
      variants: [
        { size: '28', color: 'Dark Indigo', colorHex: '#1B2A4A', sku: 'DB-JN-DI-28', stock: 10 },
        { size: '30', color: 'Dark Indigo', colorHex: '#1B2A4A', sku: 'DB-JN-DI-30', stock: 20 },
        { size: '32', color: 'Dark Indigo', colorHex: '#1B2A4A', sku: 'DB-JN-DI-32', stock: 25 },
        { size: '34', color: 'Dark Indigo', colorHex: '#1B2A4A', sku: 'DB-JN-DI-34', stock: 15 },
        { size: '36', color: 'Dark Indigo', colorHex: '#1B2A4A', sku: 'DB-JN-DI-36', stock: 8 },
      ],
      category: catJeans._id,
      collections: [colNew._id, colEssentials._id],
      tags: ['jeans', 'denim', 'slim', 'dark wash'],
      isNewArrival: true,
      fit: 'Slim', occasion: ['Casual', 'Smart Casual'],
    },
    {
      name: 'Relaxed Cargo Trousers',
      slug: 'relaxed-cargo-trousers',
      description: 'Utility-inspired cargo trousers with a contemporary relaxed cut. Multiple pockets, adjustable waist drawstring, and a premium twill weave.',
      material: '100% Cotton Twill',
      care: 'Machine wash cold. Hang dry.',
      basePrice: 1699,
      originalPrice: 2199,
      images: [
        { url: UNSPLASH.trouser1, alt: 'Cargo Trousers', order: 0 },
      ],
      variants: [
        { size: '28', color: 'Khaki', colorHex: '#C3B091', sku: 'DB-CG-KH-28', stock: 12 },
        { size: '30', color: 'Khaki', colorHex: '#C3B091', sku: 'DB-CG-KH-30', stock: 20 },
        { size: '32', color: 'Khaki', colorHex: '#C3B091', sku: 'DB-CG-KH-32', stock: 18 },
        { size: '34', color: 'Khaki', colorHex: '#C3B091', sku: 'DB-CG-KH-34', stock: 10 },
        { size: '30', color: 'Olive', colorHex: '#556B2F', sku: 'DB-CG-OL-30', stock: 15 },
        { size: '32', color: 'Olive', colorHex: '#556B2F', sku: 'DB-CG-OL-32', stock: 14 },
      ],
      category: catTrousers._id,
      collections: [colSale._id],
      tags: ['cargo', 'trousers', 'utility', 'khaki', 'olive'],
      fit: 'Relaxed', occasion: ['Casual', 'Streetwear'],
    },
    {
      name: 'Premium Oxford Button-Down Shirt',
      slug: 'premium-oxford-button-down-shirt',
      description: 'A wardrobe cornerstone. Our Oxford shirt in a premium pinpoint weave — structured enough for smart-casual, relaxed enough for everyday wear. Unlined, breathable, and beautifully constructed.',
      material: '100% Cotton Oxford Weave',
      care: 'Machine wash warm. Tumble dry low. Iron on medium.',
      basePrice: 1899,
      images: [
        { url: UNSPLASH.shirt2, alt: 'Oxford Button-Down Shirt', order: 0 },
        { url: UNSPLASH.shirt1, alt: 'Oxford Shirt detail', order: 1 },
      ],
      variants: [
        { size: 'S', color: 'White', colorHex: '#FFFFFF', sku: 'DB-OX-WH-S', stock: 20 },
        { size: 'M', color: 'White', colorHex: '#FFFFFF', sku: 'DB-OX-WH-M', stock: 30 },
        { size: 'L', color: 'White', colorHex: '#FFFFFF', sku: 'DB-OX-WH-L', stock: 25 },
        { size: 'XL', color: 'White', colorHex: '#FFFFFF', sku: 'DB-OX-WH-XL', stock: 12 },
        { size: 'S', color: 'Light Blue', colorHex: '#A8C5DA', sku: 'DB-OX-LB-S', stock: 15 },
        { size: 'M', color: 'Light Blue', colorHex: '#A8C5DA', sku: 'DB-OX-LB-M', stock: 25 },
        { size: 'L', color: 'Light Blue', colorHex: '#A8C5DA', sku: 'DB-OX-LB-L', stock: 20 },
      ],
      category: catShirts._id,
      collections: [colEssentials._id],
      tags: ['shirt', 'oxford', 'button-down', 'formal', 'smart casual'],
      isFeatured: true,
      fit: 'Regular', occasion: ['Casual', 'Smart Casual', 'Work'],
    },
  ];

  const products = await Product.insertMany(productData);
  console.log(`👕 ${products.length} demo products created`);

  // Update collection products
  await Collection.findByIdAndUpdate(colNew._id, {
    products: products.filter(p => p.isNewArrival).map(p => p._id),
  });
  await Collection.findByIdAndUpdate(colBest._id, {
    products: products.filter(p => p.isBestseller).map(p => p._id),
  });
  await Collection.findByIdAndUpdate(colEssentials._id, {
    products: [products[2]._id, products[5]._id, products[3]._id],
  });
  await Collection.findByIdAndUpdate(colSale._id, {
    products: [products[4]._id, products[0]._id, products[2]._id],
  });

  // ── Homepage Content ──────────────────────────────────────
  await HomepageContent.insertMany([
    {
      key: 'announcement',
      value: {
        message: '✨ Free Shipping on orders above ₹999 — All over India',
        isActive: true,
        bgColor: '#1A1917',
        textColor: '#FFFFFF',
      },
    },
    {
      key: 'hero',
      value: {
        heading: 'Wear What You Are',
        subheading: 'Premium menswear, designed for the modern Indian man.',
        image: UNSPLASH.hero1,
        mobileImage: UNSPLASH.hero2,
        ctaText: 'Shop Now',
        ctaLink: '/shop',
        secondaryCtaText: 'New Arrivals',
        secondaryCtaLink: '/collections/new-arrivals',
        isDemoContent: true,
        demoNote: 'Replace with actual brand copy and campaign imagery.',
      },
    },
    {
      key: 'about',
      value: {
        heading: 'Built Different',
        body: 'DB Clothing is a premium menswear label built for young Indian men who refuse to compromise on quality or style. Every piece is designed with intention — clean lines, elevated fabrics, and a fit that flatters.',
        isDemoContent: true,
        demoNote: 'Requires client review and approval before publication.',
      },
    },
    {
      key: 'policies',
      value: {
        shipping: '[DRAFT — Requires client approval] Orders dispatched within 2–3 business days. Standard delivery 5–7 business days across India.',
        returns: '[DRAFT — Requires client approval] Easy 7-day returns on unworn, unwashed items with original tags intact.',
        contact: {
          email: '[CLIENT TO PROVIDE]',
          whatsapp: '[CLIENT TO PROVIDE]',
          instagram: 'https://www.instagram.com/dbclothing.20/',
        },
      },
    },
  ]);

  console.log('🏠 Homepage content seeded');
  console.log('\n✅ Seed complete!');
  console.log(`\n📝 Demo credentials:`);
  console.log(`   Admin: ${process.env.ADMIN_EMAIL || 'admin@dbclothing.in'} / ${process.env.ADMIN_PASSWORD || 'Admin@1234'}`);
  console.log('\n⚠️  All product data, prices, and images are DEMO CONTENT for development only.');
  console.log('   Replace with actual catalogue data before going live.\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

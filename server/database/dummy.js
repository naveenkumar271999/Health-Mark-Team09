const { mongoose } = require('./database');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const hashedPassword = require('../utils/password');
const { faker } = require('@faker-js/faker');
const { Cart } = require('../models');

const users = [
    {
        firstName: "Dr.Naveen",
        lastName: "Kalyanam",
        role: "doctor",
        bio: "Experienced cardiologist with a focus on heart health and prevention.",
        isEmailVerified: true,
    },
    {
        firstName: "Dr.Nikhil",
        lastName: "m",
        role: "doctor",
        bio: "Pediatrician dedicated to providing the best care for your children.",
        isEmailVerified: true,
    },
    {
        firstName: "Dr.manideep",
        lastName: "m",
        role: "doctor",
        bio: "Orthopedic surgeon specializing in joint and musculoskeletal issues.",
        isEmailVerified: true,
    },
    {
        firstName: "Vendor",
        lastName: "satya",
        role: "vendor",
        bio: "Your trusted supplier of medical and healthcare products.",
        isEmailVerified: true,
    },
    {
        firstName: "Vendor",
        lastName: "tanmayee",
        role: "vendor",
        bio: "Quality medical equipment and supplies for healthcare professionals.",
        isEmailVerified: true,
    },
    {
        firstName: "Vendor",
        lastName: "manideep",
        role: "vendor",
        bio: "Your one-stop shop for medical supplies and pharmaceuticals.",
        isEmailVerified: true,
    },
    {
        firstName: "satya",
        lastName: "user",
        role: "user",
        bio: "A fitness enthusiast passionate about promoting a healthy lifestyle.",
        isEmailVerified: true,
    },
    {
        firstName: "tanmayee",
        lastName: "user",
        role: "user",
        bio: "Tech-savvy professional with a keen interest in emerging technologies.",
        isEmailVerified: true,
    },
    {
        firstName: "manideep",
        lastName: "user",
        role: "user",
        bio: "A book lover who enjoys exploring different genres and authors.",
        isEmailVerified: true,
    },
];

const products = [
    {
        name: "Hand Sanitizer",
        description: "Alcohol-based hand sanitizer to keep your hands clean and germ-free.",
        price: 5.99,
        units: 250,
        category: "Hygiene",
        ageRestricted: false,
    },
    {
        name: "Face Masks",
        description: "Disposable face masks to protect yourself and others from airborne viruses.",
        price: 12.99,
        units: 50,
        category: "Hygiene",
        ageRestricted: true,
    },
    {
        name: "Digital Thermometer",
        description: "A digital thermometer to check your body temperature quickly and accurately.",
        price: 9.99,
        units: 100,
        category: "Medical Devices",
        ageRestricted: false,
    },
    {
        name: "Vitamin C Supplements",
        description: "Vitamin C supplements to support your immune system and overall health.",
        price: 7.49,
        units: 60,
        category: "Supplements",
        ageRestricted: true,
    },
    {
        name: "First Aid Kit",
        description: "A comprehensive first aid kit with essential medical supplies for emergencies.",
        price: 24.99,
        units: 20,
        category: "Safety",
        ageRestricted: true,
    },
    {
        name: "Disposable Gloves",
        description: "Disposable latex gloves for protection while handling various tasks.",
        price: 8.99,
        units: 100,
        category: "Hygiene",
        ageRestricted: true,
    },
    {
        name: "Band-Aids",
        description: "Assorted sizes of band-aids for covering and protecting minor wounds.",
        price: 4.49,
        units: 100,
        category: "First Aid",
        ageRestricted: true,
    },
    {
        name: "Pain Relievers",
        description: "Pain relievers like ibuprofen or acetaminophen for headache and pain relief.",
        price: 6.99,
        units: 50,
        category: "Medicine",
        ageRestricted: true,
    },
    {
        name: "Hand Soap",
        description: "Antibacterial hand soap to wash away germs and maintain hand hygiene.",
        price: 3.49,
        units: 500,
        category: "Hygiene",
        ageRestricted: false,
    },
    {
        name: "Antiseptic Wipes",
        description: "Antiseptic wipes for cleaning and disinfecting wounds or surfaces.",
        price: 9.99,
        units: 100,
        category: "Hygiene",
        ageRestricted: true,
    },
];


const populateDummyProducts = async () => {
    for (let product of products) {
        product.vendorID = await User.aggregate([{ $match: { role: 'vendor' } }, { $sample: { size: 1 } }, { $project: { _id: 1 } }]);
        product.vendorID = product.vendorID[0]._id;
    }
    await Product.insertMany(products);
};

const populateDummyUsers = async () => {
    try {
        const user = { 
            firstName: 'admin', 
            lastName: 'temp', 
            email: 'admin@gmail.com',
            role: 'user', 
            bio: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
            isEmailVerified: true,
        };
        users.push(user);

        for(let user of users) {
            user.password = await hashedPassword('12121212');
            if (!user.email)
                user.email = faker.internet.email({ firstName: user.firstName, provider: 'gmail' });
        }

        await User.insertMany(users);
    } catch (error) {
        console.error('Error populating dummy users:', error);
    }
};


const createCartForUser = async (user) => {
    const cart = new Cart({ user: user._id });
    const randomProducts = await Product.aggregate([{ $sample: { size: 3 } }]);
    randomProducts.forEach(product => {
        cart.items.push({ product: product._id, quantity: faker.number.int({ min: 1, max: 5 }) });
    });
    await cart.save();
    return cart;
};

const seedDatabase = async () => {
    try {
        await User.deleteMany({});
        await Product.deleteMany({});
        await Cart.deleteMany({});

        await populateDummyUsers();
        await populateDummyProducts();

        const users = await User.find({});
        for (let user of users) {
            user.role === 'user' && await createCartForUser(user);
        }

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding the database:', error);
    }
};

module.exports = seedDatabase;

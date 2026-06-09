const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
    let triedPublicDns = false;

    const doConnect = async (uri) => {

        const conn = await mongoose.connect(uri || process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    };

    try {
        await doConnect();
        return;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
    }

    // Try public DNS once
    if (!triedPublicDns) {
        triedPublicDns = true;
        try {
            console.warn('⚠️  SRV lookup refused by system DNS — retrying using public DNS (8.8.8.8,8.8.4.4)');
            dns.setServers(['8.8.8.8', '8.8.4.4']);
            await doConnect();
            return;
        } catch (err) {
            console.error(`❌ Retry with public DNS failed: ${err.message}`);
        }
    }

    // As a last resort, start an in-memory MongoDB instance so the app can run
    try {
        console.warn('⚠️  Starting in-memory MongoDB (mongodb-memory-server) as fallback...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await doConnect(uri);
        console.log('ℹ️  Connected to in-memory MongoDB. Note: data is ephemeral.');
        return;
    } catch (memErr) {
        console.error(`❌ In-memory MongoDB fallback failed: ${memErr.message}`);
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected.');
});

module.exports = connectDB;
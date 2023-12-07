const fs = require('fs');

function parseTransactions(data) {
    return data.split('\n').filter(line => line.trim() !== '').map(line => {
        const [hash, timestampPart] = line.split('\t');
        const beforeTimeStamp = timestampPart.split('Timestamp:')[1].trim();
        const timestamp=new Date(beforeTimeStamp.split(' ')[0]);
        return { hash, timestamp };
    });
}

function analyzeTransactions(transactions) {
    const hashCount = {};
    const hashTime = {};
    transactions.forEach(({ hash, timestamp }) => {
        hashCount[hash] = (hashCount[hash] || 0) + 1;
        hashTime[hash] = timestamp;
    });

    const repeated = Object.keys(hashCount).filter(hash => hashCount[hash] > 1);
    const unique = Object.keys(hashCount).filter(hash => hashCount[hash] === 1);
    return { repeated, unique, hashTime };
}

function findFastestTimestamp(commonHashes, hashTimeMaps) {
    return commonHashes.map(hash => ({
        hash,
        fastest: hashTimeMaps.map(hashTime => hashTime[hash]).sort((a, b) => a - b)[0]
    }));
}




const alchemyData = fs.readFileSync('Alchemy Subway.txt', 'utf-8');
const multiNodeData = fs.readFileSync('Multinode Subway.txt', 'utf-8');
const infuraData = fs.readFileSync('Infura Subway.txt', 'utf-8');
const goerliData = fs.readFileSync('Goerli Subway.txt', 'utf-8');

const alchemyTransactions = parseTransactions(alchemyData);
const multiNodeTransactions = parseTransactions(multiNodeData);
const infuraTransactions = parseTransactions(infuraData);
const goerliTransactions = parseTransactions(goerliData);

const alchemyAnalysis = analyzeTransactions(alchemyTransactions);
const multiNodeAnalysis = analyzeTransactions(multiNodeTransactions);
const infuraAnalysis = analyzeTransactions(infuraTransactions);
const goerliAnalysis = analyzeTransactions(goerliTransactions);



const allHashes = new Set([...alchemyTransactions, ...multiNodeTransactions, ...infuraTransactions, ...goerliTransactions].map(t => t.hash));
const commonHashes = Array.from(allHashes).filter(hash => 
    alchemyAnalysis.hashTime[hash] && multiNodeAnalysis.hashTime[hash] && infuraAnalysis.hashTime[hash] && goerliAnalysis.hashTime[hash]);

// common Hashes of BlockPi with MultiNode, Infura and Goerli
const commonHashesAlchemyMultiNode = Array.from(allHashes).filter(hash => 
    alchemyAnalysis.hashTime[hash] && multiNodeAnalysis.hashTime[hash]);
const commonHashesAlchemyInfura = Array.from(allHashes).filter(hash => 
    alchemyAnalysis.hashTime[hash] && infuraAnalysis.hashTime[hash]);
const commonHashesAlchemyGoerli = Array.from(allHashes).filter(hash => 
    alchemyAnalysis.hashTime[hash] && goerliAnalysis.hashTime[hash]);

// common Hashes of Infura with Blockpi, Multinode and Goerli
const commonHashesInfuraAlchemy = Array.from(allHashes).filter(hash => 
    infuraAnalysis.hashTime[hash] && alchemyAnalysis.hashTime[hash]);
const commonHashesInfuraMultiNode = Array.from(allHashes).filter(hash => 
    infuraAnalysis.hashTime[hash] && multiNodeAnalysis.hashTime[hash]);
const commonHashesInfuraGoerli = Array.from(allHashes).filter(hash => 
    infuraAnalysis.hashTime[hash] && goerliAnalysis.hashTime[hash]);

// common Hashes of MultiNode with Blockpi, Infura and Goerli
const commonHashesMultiNodeAlchemy = Array.from(allHashes).filter(hash => 
    multiNodeAnalysis.hashTime[hash] && alchemyAnalysis.hashTime[hash]);
const commonHashesMultiNodeInfura = Array.from(allHashes).filter(hash => 
    multiNodeAnalysis.hashTime[hash] && infuraAnalysis.hashTime[hash]);
const commonHashesMultiNodeGoerli = Array.from(allHashes).filter(hash => 
    multiNodeAnalysis.hashTime[hash] && goerliAnalysis.hashTime[hash]);

// common Hashes of Goerli with Blockpi, MultiNode and Infura
const commonHashesGoerliAlchemy = Array.from(allHashes).filter(hash => 
    goerliAnalysis.hashTime[hash] && alchemyAnalysis.hashTime[hash]);
const commonHashesGoerliMultiNode = Array.from(allHashes).filter(hash => 
    goerliAnalysis.hashTime[hash] && multiNodeAnalysis.hashTime[hash]);
const commonHashesGoerliInfura = Array.from(allHashes).filter(hash => 
    goerliAnalysis.hashTime[hash] && infuraAnalysis.hashTime[hash]);

const hashTimeMaps = [alchemyAnalysis.hashTime, multiNodeAnalysis.hashTime, infuraAnalysis.hashTime,goerliAnalysis.hashTime];
const fastestTimestamps = findFastestTimestamp(commonHashes, hashTimeMaps);
//Compare time of Blockpi with MultiNode, Infura and Goerli
const fasterTimestampsAlchemyMultiNode = findFastestTimestamp(commonHashesAlchemyMultiNode, hashTimeMaps);
const fasterTimestampsAlchemyInfura = findFastestTimestamp(commonHashesAlchemyInfura, hashTimeMaps);
const fasterTimestampsAlchemyGoerli = findFastestTimestamp(commonHashesAlchemyGoerli, hashTimeMaps);

//Compare time of Multinode with Blockpi, Infura and Goerli
const fasterTimestampsMultiNodeAlchemy = findFastestTimestamp(commonHashesMultiNodeAlchemy, hashTimeMaps);
const fasterTimestampsMultiNodeInfura = findFastestTimestamp(commonHashesMultiNodeInfura, hashTimeMaps);
const fasterTimestampsMultiNodeGoerli = findFastestTimestamp(commonHashesMultiNodeGoerli, hashTimeMaps);

//Compare time of Infura with Blockpi, Multinode and Goerli
const fasterTimestampsInfuraAlchemy = findFastestTimestamp(commonHashesInfuraAlchemy, hashTimeMaps);
const fasterTimestampsInfuraMultiNode = findFastestTimestamp(commonHashesInfuraMultiNode, hashTimeMaps);
const fasterTimestampsInfuraGoerli = findFastestTimestamp(commonHashesInfuraGoerli, hashTimeMaps);

//Compare time of Goerli with Blockpi, Multinode and Infura
const fasterTimestampsGoerliAlchemy = findFastestTimestamp(commonHashesGoerliAlchemy, hashTimeMaps);
const fasterTimestampsGoerliMultiNode = findFastestTimestamp(commonHashesGoerliMultiNode, hashTimeMaps);
const fasterTimestampsGoerliInfura = findFastestTimestamp(commonHashesGoerliInfura, hashTimeMaps);

const uniqueHashes = Array.from(allHashes).filter(hash => 
    (alchemyAnalysis.hashTime[hash] ? 1 : 0) + 
    (multiNodeAnalysis.hashTime[hash] ? 1 : 0) + 
    (infuraAnalysis.hashTime[hash] ? 1 : 0) +
    (goerliAnalysis.hashTime[hash] ? 1 : 0)=== 1);




console.log('\nMultinode Subway:');
console.log('Repeated Transactions:', multiNodeAnalysis.repeated.length);
console.log('Unique Transactions:', multiNodeAnalysis.unique.length);
console.log('Total Transactions:', multiNodeTransactions.length);
const filteredTimestampsMultiNode = fastestTimestamps.filter(t => t.fastest ===multiNodeAnalysis.hashTime[t.hash]);
const filteredTimestampsMultiNodeAlchemy = fasterTimestampsMultiNodeAlchemy.filter(t => t.fastest === multiNodeAnalysis.hashTime[t.hash]);
const filteredTimestampsMultiNodeInfura = fasterTimestampsMultiNodeInfura.filter(t => t.fastest === multiNodeAnalysis.hashTime[t.hash]);
const filteredTimestampsMultiNodeGoerli = fasterTimestampsMultiNodeGoerli.filter(t => t.fastest === multiNodeAnalysis.hashTime[t.hash]);
console.log('Faster Transaction by Multinode:', filteredTimestampsMultiNode.length);
console.log('Total Transaction Multinode vs others:', fastestTimestamps.length);

console.log('Faster Transaction by Multinode vs Blockpi:', filteredTimestampsMultiNodeAlchemy.length);
console.log('Total Transaction Multinode vs Alchemy:', fasterTimestampsMultiNodeAlchemy.length);

console.log('Faster Transaction by Multinode vs Infura:', filteredTimestampsMultiNodeInfura.length);
console.log('Total Transaction Multinode vs Infura:', fasterTimestampsMultiNodeInfura.length);

console.log('Faster Transaction by Multinode vs Goerli:', filteredTimestampsMultiNodeGoerli.length);
console.log('Total Transaction Multinode vs Goerli:', fasterTimestampsMultiNodeGoerli.length);


console.log('\nAlchemy Subway:');
console.log('Repeated Transactions:', alchemyAnalysis.repeated.length);
console.log('Unique Transactions:', alchemyAnalysis.unique.length);
console.log('Total Transactions:', alchemyTransactions.length);
const filteredTimestampsAlchemy = fastestTimestamps.filter(t => t.fastest === alchemyAnalysis.hashTime[t.hash]);
const filteredTimestampsAlchemyMultiNode = fasterTimestampsAlchemyMultiNode.filter(t => t.fastest === alchemyAnalysis.hashTime[t.hash]);
const filteredTimestampsAlchemyInfura = fasterTimestampsAlchemyInfura.filter(t => t.fastest === alchemyAnalysis.hashTime[t.hash]);
const filteredTimestampsAlchemyGoerli = fasterTimestampsAlchemyGoerli.filter(t => t.fastest === alchemyAnalysis.hashTime[t.hash]);

console.log('Faster Transaction by Alchemy:', filteredTimestampsAlchemy.length);
console.log('Total Transaction Alchemy vs others:', fastestTimestamps.length);

console.log('Faster Transaction by Alchemy vs Multinode:', filteredTimestampsAlchemyMultiNode.length);
console.log('Total Transaction Alchemy vs Multinode:', fasterTimestampsAlchemyMultiNode.length);

console.log('Faster Transaction by Alchemy vs Infura:', filteredTimestampsAlchemyInfura.length);
console.log('Total Transaction Alchemy vs Infura:', fasterTimestampsAlchemyInfura.length);

console.log('Faster Transaction by Alchemy vs Goerli:', filteredTimestampsAlchemyGoerli.length);
console.log('Total Transaction Alchemy vs Goerli:', fasterTimestampsAlchemyGoerli.length);


console.log('\nInfura Subway:');
console.log('Repeated Transactions:', infuraAnalysis.repeated.length);
console.log('Unique Transactions:', infuraAnalysis.unique.length);
console.log('Total Transactions:', infuraTransactions.length);
const filteredTimestampsInfura = fastestTimestamps.filter(t => t.fastest === infuraAnalysis.hashTime[t.hash]);
const filteredTimestampsInfuraAlchemy = fasterTimestampsInfuraAlchemy.filter(t => t.fastest === infuraAnalysis.hashTime[t.hash]);
const filteredTimestampsInfuraMultiNode = fasterTimestampsInfuraMultiNode.filter(t => t.fastest === infuraAnalysis.hashTime[t.hash]);
const filteredTimestampsInfuraGoerli = fasterTimestampsInfuraGoerli.filter(t => t.fastest === infuraAnalysis.hashTime[t.hash]);

console.log('Faster Transaction by Infura:', filteredTimestampsInfura.length);
console.log('Total Transaction Infura vs others:', fastestTimestamps.length);

console.log('Faster Transaction by Infura vs Alchemy:', filteredTimestampsInfuraAlchemy.length);
console.log('Total Transaction Infura vs Alchemy:', fasterTimestampsInfuraAlchemy.length);

console.log('Faster Transaction by Infura vs Multinode:', filteredTimestampsInfuraMultiNode.length);
console.log('Total Transaction Infura vs Multinode:', fasterTimestampsInfuraMultiNode.length);

console.log('Faster Transaction by Infura vs Goerli:', filteredTimestampsInfuraGoerli.length);
console.log('Total Transaction Infura vs Goerli:', fasterTimestampsInfuraGoerli.length);


console.log('\nGoerli Subway:');
console.log('Repeated Transactions:', goerliAnalysis.repeated.length);
console.log('Unique Transactions:', goerliAnalysis.unique.length);
console.log('Total Transactions:', goerliTransactions.length);
const filteredTimestampsGoerli = fastestTimestamps.filter(t => t.fastest === goerliAnalysis.hashTime[t.hash]);
const filteredTimestampsGoerliAlchemy = fasterTimestampsGoerliAlchemy.filter(t => t.fastest === goerliAnalysis.hashTime[t.hash]);
const filteredTimestampsGoerliMultiNode = fasterTimestampsGoerliMultiNode.filter(t => t.fastest === goerliAnalysis.hashTime[t.hash]);
const filteredTimestampsGoerliInfura = fasterTimestampsGoerliInfura.filter(t => t.fastest === goerliAnalysis.hashTime[t.hash]);

console.log('Faster Transaction by Goerli:', filteredTimestampsGoerli.length);
console.log('Total Transaction Goerli vs others:', fastestTimestamps.length);

console.log('Faster Transaction by Goerli vs Alchemy:', filteredTimestampsGoerliAlchemy.length);
console.log('Total Transaction Goerli vs Alchemy:', fasterTimestampsGoerliAlchemy.length);

console.log('Faster Transaction by Goerli vs Multinode:', filteredTimestampsGoerliMultiNode.length);
console.log('Total Transaction Goerli vs Multinode:', fasterTimestampsGoerliMultiNode.length);

console.log('Faster Transaction by Goerli vs Infura:', filteredTimestampsGoerliInfura.length);
console.log('Total Transaction Goerli vs Infura:', fasterTimestampsGoerliInfura.length);

console.log('\nTotal common Transaction Hashes:',commonHashes.length);
console.log('Total Unique Transaction Hashes:', uniqueHashes.length);
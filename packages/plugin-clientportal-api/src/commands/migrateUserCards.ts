import { MongoClient } from 'mongodb';
import { nanoid } from 'nanoid';

const MONGO_URL = process.argv[2] || 'mongodb://localhost:27017/erxes';

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);

let db;

let Cards;
let ClientPortals;

const command = async () => {
  console.time('start time');
  try {
    await client.connect();
    console.debug('Connected to ', MONGO_URL);
    db = client.db();

    Cards = db.collection('client_portal_user_cards');
    ClientPortals = db.collection('client_portals');

    // update client portal kind if not set
    await ClientPortals.updateMany(
      { kind: { $exists: false } },
      { $set: { kind: 'client' } }
    );

    const cards = await Cards.find({}).toArray();

    for (const card of cards) {
      if (card.userIds && card.userIds.length > 0) {
        for (const userId of card.userIds) {
          const doc = {
            _id: nanoid(),
            contentType: card.type,
            contentTypeId: card.cardId,
            createdAt: card.createdAt,
            cpUserId: userId
          };
          await Cards.insertOne(doc);
        }

        await Cards.deleteOne({ _id: card._id });
      }
    }
  } catch (e) {
    console.error('eeeeeeee ', e);
  }

  // console.de(`Process finished at: ${new Date()}`);
  console.timeEnd('end time');

  process.exit();
};

command();

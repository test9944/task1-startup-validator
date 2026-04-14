import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID.' });
  }

  const client = await clientPromise;
  const db = client.db('startup_validator');
  const ideas = db.collection('ideas');
  const _id = new ObjectId(id);

  if (req.method === 'GET') {
    const idea = await ideas.findOne({ _id });
    if (!idea) return res.status(404).json({ error: 'Idea not found.' });
    return res.status(200).json(idea);
  }

  if (req.method === 'DELETE') {
    const result = await ideas.deleteOne({ _id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Idea not found.' });
    return res.status(200).json({ message: 'Deleted successfully.' });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}

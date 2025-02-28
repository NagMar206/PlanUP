const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.put('/update-name', async (req, res) => {
  const { userId, name } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ error: 'UserID and new name are required!' });
  }

  try {
    await req.db.execute('UPDATE Users SET Username = ? WHERE UserID = ?', [name, userId]);
    res.status(200).json({ message: 'Name updated successfully.' });
  } catch (error) {
    console.error('Error updating name:', error.message);
    res.status(500).json({ error: 'Failed to update name.', details: error.message });
  }
});

// Delete user profile
router.delete('/delete-profile', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'UserID is required!' });
  }

  try {
    await req.db.execute('DELETE FROM Users WHERE UserID = ?', [userId]);
    res.status(200).json({ message: 'Profile deleted successfully.' });
  } catch (error) {
    console.error('Error deleting profile:', error.message);
    res.status(500).json({ error: 'Failed to delete profile.', details: error.message });
  }
});

module.exports = router;

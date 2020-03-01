const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	chatId: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    numberOfNotes: { type: Number, default: 0 },
    notes: { 
    	type: [
			{
				note: {
    				type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'note',
                    unique: true
                }
			}	
    	],
        default: []
    }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
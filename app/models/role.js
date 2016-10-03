var mongoose = require('mongoose');
var beautifyUnique = require('mongoose-beautiful-unique-validation');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;
//Role Schema

var roleSchema = new Schema({

    name: {
        type: String,
        lowercase: true
        //unique: "El nombre debe ser único",
        //required: "El nombre es requerido"

    }
});

// enables beautifying
roleSchema.plugin(beautifyUnique);
roleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Role', roleSchema);

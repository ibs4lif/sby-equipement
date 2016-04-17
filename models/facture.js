var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FactueSchema = new Schema({
	camionneur:String,
	magasin:String,
	remorque:String,
	route:String,
	porte:String,
	reference:String,
	items:Array,
	date:String,
	published:{
		type:Date,
		default:new Date
	}
});

module.exports = mongoose.model('facture',FactueSchema);
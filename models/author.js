const mongoose = require('mongoose');

const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: { type: String, required: true, maxLenght: 100 },
    family_name: { type: String, required: true, maxLenght: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date }
});

//Virtual for author's full name
AuthorSchema.virtual("name").get(
    function() {
        //To avoid errors in cases where an author does not have either a family anme or first name
        //We want to make sure we handle the exception by returning an empty string for that case
        let fullname = "";
        if (this.first_name && this.first_name) {
            fullname = `${this.family_name}, ${this.first_name}`;
        }
        if (!this.first_name || !this.family_name) {
            fullname = "";
        }
        return fullname;
    }
);

AuthorSchema.virtual("url").get(
    function() {
        //We don't use an arrow function as we'll need the this object
        return `/catalog/author/${this._id}`;
    }
);

AuthorSchema.virtual("life_span_formatted").get(function () {
    if (this.date_of_death){
        return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATETIME_MED) + " - " +
        DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATETIME_MED);
    }
    if (this.date_of_birth){
        return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATETIME_MED) + " - Present";
    }
    return "Date of birth not available";
  });

//Export model
module.exports = mongoose.model("Author", AuthorSchema);
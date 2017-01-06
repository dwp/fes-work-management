const slug = require('slug')
const _ = require('lodash')

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {}
  
  /**
   * creates a 'slug' from a string value
   * @method slug
   * @param  {string} input   the string to be 'slugged'
   * @param  {Object} options the settings object for npm slug module
   * @return {String}         the manipulated string
   */
  filters.slug = function(input, options){
    let defaultOptions = {
      lower: true
    }
    return slug(input, options ? _.merge(defaultOptions, options) : defaultOptions)
  };
	
	/**
	 * comprehensive function to convert a string to sentence 
	 * @method toSentanceCase
	 * @param  {[type]}       str [description]
	 * @return {[type]}           [description]
	 */
	filters.toSentenceCase = function toSentenceCase(str) {

    var states = {
        EndOfSentence  : 0,
        EndOfSentenceWS: 1, // in whitespace immediately after end-of-sentence
        Whitespace     : 2,
        Word           : 3
    };

    var state = states.EndOfSentence;
    var start = 0;
    var end   = 0;

    var output = "";
    var word = "";

    function specialCaseWords(word) {
        if( word == "i" ) return "I";
        if( word == "assy" ) return "assembly";
        if( word == "Assy" ) return "Assembly";
        return word;
    }

    for(var i = 0; i < str.length; i++) {

        var c = str.charAt(i);

        switch( state ) {
            case states.EndOfSentence:

                if( /\s/.test( c ) ) { // if char is whitespace

                    output += " "; // append a single space character
                    state = states.EndOfSentenceWS;
                }
                else {
                    word += c.toLocaleUpperCase();
                    state = states.Word;
                }

                break;

            case states.EndOfSentenceWS:

                if( !( /\s/.test( c ) ) ) { // if char is NOT whitespace

                    word += c.toLocaleUpperCase();
                    state = states.Word;
                }

                break;
            case states.Whitespace:

                if( !( /\s/.test( c ) ) ) { // if char is NOT whitespace

                    output += " "; // add a single whitespace character at the end of the current whitespace region only if there is non-whitespace text after.
                    word += c.toLocaleLowerCase();
                    state = states.Word;
                }

                break;

            case states.Word:

                if( c == "." ) {

                    word = specialCaseWords( word );
                    output += word;
                    output += c;
                    word = "";
                    state = states.EndOfSentence;

                } else if( !( /\s/.test( c ) ) ) { // if char is NOT whitespace

                    // TODO: See if `c` is punctuation, and if so, call specialCaseWords(word) and then add the puncutation

                    word += c.toLocaleLowerCase();
                }
                else {
                    // char IS whitespace (e.g. at-end-of-word):

                    // look at the word we just reconstituted and see if it needs any special rules
                    word = specialCaseWords( word );
                    output += word;
                    word = "";

                    state = states.Whitespace;
                }

                break;
        }//switch
    }//for

    output += word;

    return output;
	}
	
	filters.unescape = _.unescape;
  
  /**
   * take an email string and return the part before the @ character
   * @method getUserNameFromEmail
   * @param  {string}             email Email address string
   * @return {string}                   formatted string
   */
  filters.getUserNameFromEmail = function getUserNameFromEmail(email) {
    return (email ? filters.toSentenceCase(email.split('@')[0].replace('.',' ')) : false);
  };

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}

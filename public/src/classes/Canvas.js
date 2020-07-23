/**
 * @desc This class contains methods to manipulate the given HTML canvas by adding, removing or checking for classes
*/
class Canvas {
    /** 
     * @desc this method checks whether given element belongs to a the class in the DOM
     * @param {Object} element is the DOM element
     * @param {String} className is the name of the class to check for
    */
    hasClass(element, className) {
        if (element.classList)
            return element.classList.contains(className);
        else
            return !!element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }

     /** 
     * @desc this method adds a class to the DOM element
     * @param {Object} element is the DOM element
     * @param {String} className is the name of the class to add to the element's classList
    */
    addClass(element, className) {
        if (element.classList)
            element.classList.add(className);
        else if (!this.hasClass(element, className)) element.className += " " + className;
    }
    
     /** 
     * @desc this method removes a class to the DOM element
     * @param {Object} element is the DOM element
     * @param {String} className is the name of the class to remove from the element's classList
    */
    removeClass(element, className) {
        if (element.classList)
            element.classList.remove(className);
        else if (this.hasClass(element, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            element.className=element.className.replace(reg, ' ');
        }
    }
}

export default Canvas;
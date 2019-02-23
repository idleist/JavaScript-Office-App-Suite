// *** IMAGES PAGE ***

const imagesContainer = document.getElementById('image--container');
// * Back Button
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', function(){
    window.history.back();
});

var images = {
    width: "200px",
    height: "auto",
    image: [
        {
            src: "https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?auto=compress&cs=tinysrgb&h=350", 
            name: "paint materials"
        },
        {
            src: "https://images.pexels.com/photos/358502/pexels-photo-358502.jpeg?auto=compress&cs=tinysrgb&h=350", 
            name: "city skyline"
        },
        {
            src: "https://images.pexels.com/photos/57627/pexels-photo-57627.jpeg?auto=compress&cs=tinysrgb&h=350",
            name: "dogs on bed"
        }
    ],

    };

    function largerImage(image){
        image.style.height = '300px';
        image.style.width = '300px';
    }

    function normalImage(image){
        image.style.height = 'auto';
        image.style.width = '200px';
    }

window.onload = function(){
    // iterates through images object and creates div for each in the DOM

    // Using a while loop instead of a for loop
    var i = 0;
    while(images.image[i]){
        let div = document.createElement('div');
        div.setAttribute('class', 'image--container');
        let image = document.createElement('img');

        // use of the with function to add multiple attributes to image object
        with(image){
            setAttribute('src', images.image[i].src);
            setAttribute('onmouseover', 'largerImage(this)');
            setAttribute('onmouseout', 'normalImage(this)');
            setAttribute('width', images.width);
            setAttribute('height', images.height);
            setAttribute('alt', images.name);
        };

        // image.setAttribute('src', images.image[i].src);
        // image.setAttribute('onmouseover', 'largerImage(this)');
        // image.setAttribute('onmouseout', 'normalImage(this)');
        // image.setAttribute('width', images.width);
        // image.setAttribute('height', images.height);
        div.appendChild(image);
        imagesContainer.appendChild(div);
        i++;
    }

};



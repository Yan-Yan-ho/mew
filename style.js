document.addEventListener('click',documentClick);

function documentClick(e){
    const targetItem = e.target;
    if(targetItem.closest('.icon-menu')){
        document.documentElement.classList.toggle('menu-open');
    }
}


const ratings = document.querySelectorAll('.rating');

if(ratings.length > 0){
    initRatings();
}

//основна функція
function initRatings(){
    let ratingActive, ratingValue;
    //перебір всіх рейтенгів на сторінці
    for(let index = 0; index < ratings.length; index++){
        const rating = ratings[index];
        initRating(rating);
    }
    // ініціалізація конкретного рейтинга
    function initRating(rating){
        initRatingVars(rating);
        
        setRatingActiveWidth();

        if(rating.classList.contains('rating-set')){
            setRating(rating);
        }
    }
    // ініціалізація переміних
    function initRatingVars(rating){
        ratingActive = rating.querySelector('.rating-active');
        ratingValue  = rating.querySelector('.rating-value');
    }
    // змінюємо ширину активниз зірок
    function setRatingActiveWidth(index = ratingValue.innerHTML){
        const ratingActiveWidth = index / 0.05;
        ratingActive.style.width = `${ratingActiveWidth}%`;
    }
     //можливість вказати оцінку
    function setRating(rating){
        const ratingItems = rating.querySelectorAll('.rating-item');
        for(let index = 0; index < ratingItems.length; index++){
            const ratingItem = ratingItems[index];
            ratingItem.addEventListener("mouseenter", function (e) {
            // обновлення переміних
            initRatingVars(rating);
            // обновлення акивних зірок
            setRatingActiveWidth(ratingItem.value);
            });
            ratingItem.addEventListener("mouseleave", function (e) {
                setRatingActiveWidth();
            });
            ratingItem.addEventListener("click",function(e){
                // обновлення переміних
            initRatingVars(rating);

            if(rating.dataset.ajax){
                //відправка на сервер
                setRatingValue(ratingItem.value, rating);
            }else{
                //відобразити вказану оцінку
                ratingValue.innerHTML = index + 1;
                setRatingActiveWidth();
            }
          });
        }
    }   
}
    
    async function setRatingValue(value,rating){
        if(!rating.classList.contains('rating-sending')){
            rating.classList.add('rating-sending');
            //відправка даних value на сервер
            let response = await fetch ('rating.json',{
               method: 'GET', 
               //body: JSON.stringify({
               //}),
               //headers:{
               // 'content-type': 'application/json'
               //}
            });
            if(response.ok){
                const result = await response.json();
                // получаємо новий рейтинг
                const newRating = result.newRating;
                // вивод нового середнього результату
                ratingValue.innerHTML = newRating;

                // оновлення активних зірок
                setRatingActiveWidth();

                rating.classList.remove('reting-sending');               
            }else{
                alert('Помилка');

                rating.classList.remove('rating-sending');
            }
        }
    } 


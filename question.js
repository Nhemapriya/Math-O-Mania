
var answer;
var score = 0;
var bgImages = [];

function nextQuestion() {
    const n1 = Math.floor(Math.random() * 5);
    document.getElementById('n1').innerHTML = n1;
    const n2 = Math.floor(Math.random() * 6);
    document.getElementById('n2').innerHTML = n2;
    answer = n1+n2;
}

function check()
{
    const prediction = predictImage();
    console.log(`answer ${answer} prediction ${prediction}`);
    if(prediction == answer)
    {
        score++;
       

        if(score <= 6)
        {
            bgImages.push(`url('images/background${score}.svg')`);
            document.body.style.backgroundImage = bgImages;
            
        }
        else{
            alert("Whoa !! your score is "+score +" start again !! Have fun");
            score = 0;
            bgImages = [];
            document.body.style.backgroundImage = bgImages;
        }   
    }
    else{
        if(score!=0)
        {
            score--;
            alert('Check your answer or try writing again');
            setTimeout(function() {
                bgImages.pop();
                document.body.style.backgroundImage = bgImages;
            }, 1000);
        }
    }
}


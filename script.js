// User input for no of lifts
const lift_num = document.querySelector('#lifts');

// User input for no of floors
const floor_num = document.querySelector('#floors');

// adding the floors dynamically into the floors_space
const floors_space = document.querySelector('#floors_lifts');

// Button for submitting the user input
const sbmit_lift_floor_num = document.querySelector('#sbmit');

// for storing all the floors reference nodelist
let allFloor;

// for storing all the lifts reference nodelist
let allLifts;

// Keeps track of which lift is in which floor currently
let curLiftPos = [];

// whether the ith lift is busy
let isBusy = [];

let num_floors = 2;
let first_floor;

// Initializing with 2 floors and 1 lifts
refresh(2, 1);

sbmit_lift_floor_num.addEventListener('click', (e) => {
    const floorVal = floor_num.value;
    const liftVal = lift_num.value;
    num_floors = floorVal;
    refresh(floorVal, liftVal);
    e.preventDefault();
});

// Everytime the function gets called whenever the user enters
// the no of floors and no of lifts
function refresh(floorVal, liftVal) {

    // Emptying the previous no of floors to add 
    // the user entered no of floors
    floors_space.innerHTML = "";

    // Adding floors dynamically after user enters
    for(let i = floorVal; i > 0; i--) {
        let floorNo = 'Floor '+i;
        let newFloor = document.createElement('div');
        newFloor.classList.add('floor');
        newFloor.innerHTML = `
            <button id="up" class="button">UP</button>
            <button id="dn" class="button">DN</button>
            <p>${floorNo}</p>
        `;
        floors_space.appendChild(newFloor);
        first_floor = newFloor;
    }

    // Every time the no of floors changes it gets chnaged
    // So updating the no of buttons
    allFloorButtons = document.querySelectorAll('.floor .button');
    const floor_height = document.querySelector('.floor').offsetHeight;

    // It adds the no of lifts entered by the user
    // in the floors_space
    for(let i = 1; i <= liftVal; ++i) {
        const newLift = document.createElement('div');
        newLift.classList.add('lifts');
        newLift.innerHTML = `
            <div class="gate" id="left_gate"></div>
            <div class="gate" id="right_gate"></div>
        `;

        first_floor.appendChild(newLift);
        newLift.style.left = i*15+"%";
        // newLift.style.top = ((floorVal - 1)*floor_height)+'px';
        
        // It tells ith lift is present in which floor currently
        curLiftPos[i - 1] = ((floorVal - 1)*floor_height);

        // whether this lift is busy or free
        // intially every lift is free
        isBusy[i - 1] = false;
    }

    // Everytime the no of lifts gets changed 
    // It is updated in the allLifts var
    allLifts = document.querySelectorAll('.lifts');

    allFloorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            var intc = setInterval(() => {
                let freeLift = findFreeLift(btn);
                if(freeLift !== -1) {
                    clearInterval(intc);
                    moveLift(btn, freeLift);
                }
            }, 5);
        });
    });
}

// returns which lift is free
function findFreeLift(btn) {
    let prevDiff = Number.MAX_SAFE_INTEGER;
    let free = -1;
    const parBtnPos = btn.parentElement.offsetTop;
    for(let i = 0;i<isBusy.length;++i) {
        if(!isBusy[i]) {
            if(Math.abs(parBtnPos - curLiftPos[i]) < prevDiff) {
                free = i;
                prevDiff = Math.abs(parBtnPos - curLiftPos[i]);
            }
        }
    }

    if(free !== -1) {
        // Making the lift busy
        isBusy[free] = true;
        return free;
    }

    return -1;
}

function moveLift(btn, freeLift) {

    // previous position
    let prevPos = curLiftPos[freeLift];

    let floor_height = btn.parentElement.offsetHeight;
    let to = btn.parentElement.offsetTop;
    curLiftPos[freeLift] = to;

    let time = Math.abs(preCurGap(btn, prevPos));
    // taking the lift to the specified floor
    allLifts[freeLift].style.transitionDuration = ` ${time}s`;
    allLifts[freeLift].classList.toggle('running');
    allLifts[freeLift].style.transform = `translateY(${-(((num_floors - 1)
     - to / floor_height) * 100)}%)`;

    setTimeout(() => {
        // Lift stopped
        allLifts[freeLift].classList.toggle('running');
        // scheduling the lift for gate open and close
        allLifts[freeLift].classList.toggle('stopped');
        setTimeout(() => {
            allLifts[freeLift].classList.toggle('stopped');
            isBusy[freeLift] = false;
        }, 5000);
    }, time*1000);
    
}

function preCurGap(btn, pre) {
    let gap = (btn.parentElement.offsetTop - pre) / btn.parentElement.offsetHeight;
    return gap;
}
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

// Initializing with 2 floors and 1 lifts
refresh(2, 1);

sbmit_lift_floor_num.addEventListener('click', (e) => {
    const floorVal = floor_num.value;
    const liftVal = lift_num.value;
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
        floors_space.appendChild(newLift);
        newLift.style.left = i*15+"%";
        newLift.style.top = ((floorVal - 1)*floor_height)+'px';

        // It tells ith lift is present in which floor currently
        curLiftPos[i - 1]=((floorVal - 1)*floor_height);

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

// This fucntion returns the gap between the floor and
// the nearby lift.
function scheduleLift(btn, freeLift) {
    // the floors button pressed
    const parentBtn = btn.parentElement;

    // Floor top position w.r.t floors_space
    const topPos = parentBtn.offsetTop;
    return ((topPos - curLiftPos[freeLift]) / parentBtn.offsetHeight);
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

    // finding the gap between lift and the floor
    let gapLiftToFloor = scheduleLift(btn, freeLift);

    curLiftPos[freeLift] = btn.parentElement.offsetTop;
    console.log(freeLift, curLiftPos[freeLift]);
    // changing the lift's state from stopping to running
    allLifts[freeLift].classList.add('running');

    // taking the lift to the specified floor
    allLifts[freeLift].style.top = curLiftPos[freeLift]+'px';
    allLifts[freeLift].style.transitionDuration = Math.abs(gapLiftToFloor)+'s';

    setTimeout(() => {
        // Lift stopped
        allLifts[freeLift].classList.remove('running');

        // scheduling the lift for gate open and close
        allLifts[freeLift].classList.toggle('stopped');
        setTimeout(() => {
            allLifts[freeLift].classList.toggle('stopped');
            isBusy[freeLift] = false;
        }, 5000);
    }, (Math.abs(gapLiftToFloor)+0.2)*1000);
    
}
const ALLOWEDCHARACTERS = new RegExp("^([-+]? ?(\d+|\(\g<1>\))( ?[-+*\/] ?\g<1>)?)$");


class CNumber{
	constructor(){
		this.array = [];
		this.isDesimal = false;
		this.isNegative = false;
	}
}

class CEquation{
	constructor(){
		this.array = [];
		this.numbArray = [];
		this.current = new CNumber();
		this.isParantesOpen = false;
	}
}

let eq = new CEquation();

function Clear(){
	eq = new CEquation();
	ShowEQ();
}

function NumberPressed(number){
	this.pushIt = function(){
		eq.current.array.push(number);
	}
	if(eq.array[eq.array.length-1] == ")"){
		AddOperation("*");
	}
	if (number != 0) {
		this.pushIt();
	}
	else {
		if (eq.current.array.length == 0) {
			this.pushIt();
		}
		else if (eq.current.array[0] != 0){
			this.pushIt();
		}
		else if(eq.current.isDesimal){
			this.pushIt();
		}
	}
	ShowEQ();
}

function PlusMinus(){
	eq.current.isNegative = !eq.current.isNegative;
	ShowEQ();
}

function AddComma(){
	if(!eq.current.isDesimal){
		if(eq.current.array.length > 0){
			eq.current.array.push(".");
		}
		else{
			eq.current.array.push(0);
			eq.current.array.push(".");
		}
		eq.current.isDesimal = true;
		ShowEQ();
	}
}

function AddOperation(operation){
	MakeCurrent();
	if(eq.array.length > 0){
		switch (eq.array[eq.array.length-1]) {
			case "+":
			case "-":
			case "*":
			case "/":
			case "(":
				break;
			default:
				eq.array.push(operation);
				ShowEQ();
				break;
		}
	}
}

function MakeParantes() {
	MakeCurrent();
	switch (eq.array[eq.array.length-1]) {
		case "+":
		case "-":
		case "*":
		case "/":
			if(eq.isParantesOpen){
				return;
			}
			break;
		default:
			if(eq.array.length != 0 && !eq.isParantesOpen)
				eq.array.push("*");
			break;
	}
	if(!eq.isParantesOpen){
		eq.array.push("(");
	}
	else{
		eq.array.push(")");
	}
	eq.isParantesOpen = !eq.isParantesOpen;
	ShowEQ();
}

function RemoveChar() {
	var rp = eq.array[eq.array.length-1];
	if(eq.current.array.length > 0){
		eq.current.array.pop();
	}
	else if(rp == "+"|| rp == "-" || rp == "*" || rp == "/"){
		eq.array.pop();
		OpenOld();
	}
	else if(eq.array.length > 0){
		OpenOld();
		eq.current.array.pop();
	}
	ShowEQ();
}

function MakeCurrent(){
	if(eq.current.array.length == 0){
		return;
	}
	this.numberString = "";
	if(eq.current.isNegative){
		this.numberString += "-";
	}
	eq.current.array.forEach(value => {
		this.numberString += value;
	});
	eq.array.push(this.numberString);
	eq.numbArray.push(eq.current);
	eq.current = new CNumber();
}

function OpenOld() {
	eq.current = new CNumber();
	this.tempString = eq.array[eq.array.length-1];
	if(this.tempString.search(RegExp("-")) >= 1){
		eq.current.isNegative = true;
		this.tempString.replace("-", "");
	}
	if(this.tempString.search(RegExp(".")) >= 1){
		eq.current.isDesimal = true;
	}
	for (let index = 0; index < this.tempString.length; index++) {
		const element = this.tempString[index];
		eq.current.array.push(element);
	}
	eq.array.pop();
}

function Sum(){
	if(eq.array.length == 0)
		return;
	MakeCurrent();
	var plus = true, multi = true, parenteses = true;
	while(plus){
		plus = false;
		while(multi){
			multi = false;
			while(parenteses){
				let parStart, parEnd;
				parenteses = false;
				eq.array.forEach((element, index) => {
					if(element == "("){
						parStart = index;
					}
					if(element == ")"){
						parEnd = index;
						let tempArray = eq.array.slice(parStart, parEnd);
						tempArray.shift();
						while (tempArray.length > 1) {
							for (let i = 0; i < tempArray.length; i++) {
								const el = tempArray[i];
								switch (el) {
									case "*":
										var firstNumb = parseFloat(tempArray[i-1]), lastNumb = parseFloat(tempArray[i + 1]);
										tempArray[i+1] = firstNumb * lastNumb;
										tempArray.splice(i-1, 2);
										break;
									case "/":
										var firstNumb = parseFloat(tempArray[i-1]), lastNumb = parseFloat(tempArray[i + 1]);
										tempArray[i+1] = firstNumb / lastNumb;
										tempArray.splice(i-1, 2);
										break;
								}
							}
							for (let i = 0; i < tempArray.length; i++) {
								const el = tempArray[i];
								switch (el) {
									case "+":
										var firstNumb = parseFloat(tempArray[i-1]), lastNumb = parseFloat(tempArray[i + 1]);
										tempArray[i+1] = firstNumb + lastNumb;
										tempArray.splice(i-1, 2);
										break;
									case "-":
										var firstNumb = parseFloat(tempArray[i-1]), lastNumb = parseFloat(tempArray[i + 1]);
										tempArray[i+1] = firstNumb - lastNumb;
										tempArray.splice(i-1, 2);
										break;
								}
							}
						}
						eq.array[parEnd] = tempArray[0];
						eq.array.splice(parStart, parEnd-parStart);
					}
				});
			}
			eq.array.forEach((element, index) => {
				if(element == "*"){
					multi = true;
					CalcMulti(index);
				}
				if(element == "/"){
					multi = true;
					CalcDivi(index);
				}
			});
		}
		eq.array.forEach((element, index) => {
			if(element == "+"){
				plus = true;
				CalcPlus(index);
			}
			if(element == "-"){
				plus = true;
				CalcMinus(index);
			}
		});
	}
	eq.array[0] = eq.array[0] + "";
	OpenOld();
	ShowEQ();
}

function CalcPlus(index){
	var firstNumb = parseFloat(eq.array[index-1]), lastNumb = parseFloat(eq.array[index + 1]);
	eq.array[index+1] = firstNumb + lastNumb;
	eq.array.splice(index-1, 2);
}

function CalcMinus(index){
	var firstNumb = parseFloat(eq.array[index-1]), lastNumb = parseFloat(eq.array[index + 1]);
	eq.array[index+1] = firstNumb - lastNumb;
	eq.array.splice(index-1, 2);
}

function CalcMulti(index){
	var firstNumb = parseFloat(eq.array[index-1]), lastNumb = parseFloat(eq.array[index + 1]);
	eq.array[index+1] = firstNumb * lastNumb;
	eq.array.splice(index-1, 2);
}

function CalcDivi(index){
	var firstNumb = parseFloat(eq.array[index-1]), lastNumb = parseFloat(eq.array[index + 1]);
	eq.array[index+1] = firstNumb / lastNumb;
	eq.array.splice(index-1, 2);
}

function ShowEQ(){
	this.disText = document.getElementById("disText");
	this.buildString = "";
	if(eq.array.length > 0){
		eq.array.forEach(value => {
			this.buildString += value;
		});
	}
	if(eq.current.array.length > 0){
		if(eq.current.isNegative){
			this.buildString += "-";
		}
		eq.current.array.forEach(value => {
			this.buildString += value;
		});
	}

	if(buildString != ""){
		this.disText.innerHTML = buildString;
	}
	else{
		this.disText.innerHTML = "Enter your numbers";
	}
}
// const { compileFunction } = require("vm");


//preparing the side and main tables
var s_table = document.getElementById("s_table");
var main_table = document.getElementById("main_table")
s_table.style.overflow = "auto";

var xhr = new XMLHttpRequest();


// Sidelist init
xhr.open("GET", "http://localhost:8080/api/side/send", false);
xhr.send(null);
var sidelist = JSON.parse(xhr.responseText);
console.log(sidelist)

var values = Object.values(sidelist);
values.sort();
console.log(values);
for (let i = values.length-1; i >= 0; i--) {
    start_prod = values[i];
    start_element = null
    addProduct(start_prod, start_element);
} 


//Mainlist init
xhr.open("GET", "http://localhost:8080/api/main/send", false);
xhr.send(null);
var mainlist = JSON.parse(xhr.responseText);
console.log(mainlist);
var main_values = Object.values(mainlist);
console.log(main_values);
for (let j = main_values.length-1; j >= 0; j--) {
    main_line = main_values[j]
    var main_product = main_line["product"];
    var main_amount = main_line["amount"];
    var main_check = main_line["check"]
    console.log(main_product + " + " + main_amount);
    addToMain(main_amount, main_product, main_check);
}
//preparing the sidelist for the side table
var products = []


//Trigger Button Click on Enter
var input_side = document.getElementById("product");
input_side.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        
        var product = document.getElementById("product").value;
        event.preventDefault();
        var elementExists = document.getElementById(product+"_s");
        createProduct();
        input_side.value = '';
    }
}); 


//create product
function createProduct() {
    //the init
    var product = document.getElementById("product").value;
    var elementExists = document.getElementById(product+"_s");
    input_side.value = '';
    if (product != '') {
        console.log("sending");
        //send to server
        values.push(product);

        xhr.open("POST", "http://localhost:8080/api/side/add", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "product": product
        }));
        console.log(xhr.responseText);
        //
    }
    addProduct(product, elementExists);
}

function addProduct(product, elementExists) {

    if (elementExists == null & product != ''){
        var prod_row = s_table.insertRow(1);
        prod_row.style.backgroundColor = "lightblue";
        var input_cell = prod_row.insertCell(0);
        var prod_cell = prod_row.insertCell(1);
        var add_cell = prod_row.insertCell(2);
        var rmv_cell = prod_row.insertCell(3);

        input_cell.style.width = "20%";
        //text box
        prod_cell.innerHTML = product;
        prod_cell.style.textAlign = "center";
        prod_cell.id = product + "_s";


        //add button
        var addbtn = document.createElement("BUTTON");
        add_cell.style.textAlign = "center";
        addbtn.innerHTML = "🛒";
        addbtn.id = product + "_add";
        addbtn.style.backgroundColor = "green";
        addbtn.onclick = function () {
            input_value = input.value;
            is_check = false;
            addToMain(input_value, product, is_check);
            input.onfocus = function() {
                this.value = '';
            }
        }

        //appending the addbutton to the add_cell
        add_cell.appendChild(addbtn)
        
        //input cell
        var input = document.createElement("input");
        input.size = 4; 
        input.type = "number";
        input.min = 0;
        input.max = 99;
        input.id = product + "_input";
        input_cell.style.textAlign = "center";
        input_cell.appendChild(input);
        input.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                input_value=input.value;
                is_check = false;
                addToMain(input_value, product, is_check);
            }
        });

        input.onfocus = function() {
            this.value = '';
        }

        //appending the remove button to the rmv_cell
        var rmvbtn = document.createElement("BUTTON");
        rmvbtn.innerHTML = "🗑️";
        rmvbtn.id = product + "_rmv";
        rmvbtn.style.backgroundColor = "red";
        rmvbtn.onclick = function() {

            if (confirm("למחוק את הפריט מהמדף?")) {
                // remove from table
                prod_row.remove();

                // remove to server
                var index = values.indexOf(product);
                if (index > -1) {
                    values.splice(index, 1);
                }
                url = "http://localhost:8080/api/side/delete/" + product

                xhr.open("GET", url, false);
                xhr.send(null);
                console.log(xhr.responseText);
                //
            }
        }
        rmv_cell.style.textAlign = "center";
        rmv_cell.appendChild(rmvbtn)
        

        //add to main table function
    
    }
    else {
        if (product == '') {
            alert("יש להכניס שם מוצר")
        } else {
            console.log(product);
            alert("המוצר כבר קיים ברשימה")
        }
    }
    // if (val != -1) {
    //     input.value = val;
    // }
}


function addToMain(input_value, product, is_check) {
    var val = input_value;
    var elementExists = document.getElementById(product + "_tb");
    if (elementExists == null & input_value > 0) {
        // add to server
        var jsontomain = {
            "product": product,
            "amount": input_value,
            "check": is_check
        }
        values.push(jsontomain);

        xhr.open("POST", "http://localhost:8080/api/main/add", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(jsontomain));
        //console.log(xhr.responseText);        

        //

        // add to table
        var row = main_table.insertRow(1);
        //create cells
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        cell0.style.textAlign = "center";
        cell1.style.textAlign = "center";
        cell2.style.textAlign = "center";
        cell3.style.textAlign = "center";
        cell4.style.textAlign = "center";
        

        //change back ground if it is checked
        if(is_check == true) {
            row.style.backgroundColor = "lightgreen";
        }

        //create CheckBox
        var checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.checked = is_check;
        checkbox.onclick = function() {
            //checkbox.checked = !is_check;
            is_check = checkbox.checked;
            if(is_check == true) {
                console.log("good!!");
                row.style.backgroundColor = "lightgreen";
            } else {
                row.style.backgroundColor = "transparent";
            }

            applyMain(input_value,checkbox.checked);
        }

        //create remove button
        var rmvbtn2 = document.createElement("BUTTON");
        rmvbtn2.innerHTML = "🗑️";
        rmvbtn2.style.backgroundColor = 'red';
        rmvbtn2.id = product + "_rmv2";
        rmvbtn2.onclick = function () {
            if (confirm("למחוק את הפריט מהעגלה?")) {
                row.remove();

                // remove to server
                var temp = {"product": product, "amount": input_value}
                var index = main_values.indexOf(temp);
                if (index > -1) {
                    main_values.splice(index, 1);
                }
                url = "http://localhost:8080/api/main/delete/" + product

                xhr.open("GET", url, false);
                xhr.send(null);
                console.log(xhr.responseText);
                //
            }
        }

        //create edit button
        var edtbtn = document.createElement("BUTTON");
        edtbtn.innerHTML = "✎";
        edtbtn.id = product + "_edt";
        edtbtn.onclick = function() {
            //the input for editing
            var input1 = document.createElement("input");
            input1.setAttribute('type', 'number');
            input1.min = 0;
            input1.max = 9;
            if (val != -1) {
                input1.value = val;
                console.log("YESS!");
            } else {
                input1.value = input_value;
                console.log("MISSED IT!");
            }

            //the save button
            var savebtn = document.createElement("BUTTON");
            savebtn.innerHTML = "💾";
            savebtn.onclick = function() {
                val = input1.value;
                input_value = input1.value;
                applyMain(input1.value, checkbox.checked)
            }
            cell3.innerHTML = '';
            cell3.appendChild(savebtn);
            //change the cells to the input and save to insert
            cell0.innerHTML = '';
            cell0.appendChild(input1);

            
            //event input for "enter"
            input1.addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    val = input1.value;
                    input_value = input1.value;
                    console.log(checkbox.checked);
                    var to_send = checkbox.checked;
                    applyMain(input1.value, to_send);
                }
            });
        }
        //apply to main table
        function applyMain(input1_value, checkbox_check) {
            // Check if not empty input & input bigger than 0 zero
            if (input1_value != '' & input1_value > 0){
                console.log("EDITING!!!")
                // apply in server
                var jsontomain = {
                    "product": product,
                    "amount": input1_value,
                    "check": checkbox_check
                }

                console.log(jsontomain);
                values.push(jsontomain);
        
                xhr.open("POST", "http://localhost:8080/api/main/edit", false);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(jsontomain));
                console.log(xhr.responseText);

                //apply the changes by onclick
                cell0.innerHTML = '';
                cell3.innerHTML = '';
                cell0.innerHTML = input1_value;
                cell3.appendChild(edtbtn);
            } else {
                alert("יש לעדכן את הכמות למספר");
            }
        }

    } else {
        if (elementExists != null) {
            alert('הפריט כבר קיים ברשימה שלך');
        } else {
            alert('נא להזין מספר');
        }
    }
    cell0.innerHTML = input_value;
    cell1.innerHTML = product;
    cell1.id = product + "_tb";
    cell2.appendChild(rmvbtn2);
    cell3.appendChild(edtbtn);
    cell4.appendChild(checkbox);
    console.log(main_table);
}

function straightRow(row) {
    for (var i = 0; i < row.length; i++) {
        row[i].style.alignContent = "center";
    }
}

var deleteList = document.getElementById("rmv_list");
var deleteListBTN = document.createElement("button");
deleteListBTN.innerHTML = 'מחק רשימה'
deleteListBTN.style.backgroundColor = '#8B0000';
deleteListBTN.style.color = "white";
deleteListBTN.onclick = function(){
    if (main_table.rows.length > 1){
        if (confirm("האם את/ה בטוח/ה שברצונך למחוק את הרשימה?")) {
            console.log("length" + main_table.rows.length);
            //Delete from server
            xhr.open("GET", "http://localhost:8080/api/main/deleteAll", false);
            xhr.send(null);

            for (var i = main_table.rows.length - 1; i > 0; i--) {
                main_table.deleteRow(i);
            }
        }
    }
}
deleteList.appendChild(deleteListBTN);

function search() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    tr = s_table.getElementsByTagName("tr");
    console.log(tr)
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}

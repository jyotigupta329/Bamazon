var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: "8889",
    user: "root",
    password: "root",
    database: "bamazon_db"
})

connection.connect(function (err) {
    if (err) throw err
    console.log("Connection as Id : " + connection.threadId);
    checkOrderAvailability();
})

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

function checkOrderAvailability() {
    inquirer.prompt([
        {
            name: "orderId",
            type: "rawlist",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            message: "Select from below options"

        }
    ]).then(function (response) {
        console.log(response);
        if (response.orderId === "View Products for Sale") {
            // console.log("I was called!!");
            queryAllItems();
            // console.log("I was showed you the results!!");
        }
        else if (response.orderId === "View Low Inventory") {
            queryLowInventory();

        } else if (response.orderId === "Add to Inventory") {
            userAddMore();
        } else if (response.orderId === "Add New Product") {
            userAddInventory();
        }
    })
}

// 1. Display all items in the store

function queryAllItems() {
    connection.query("SELECT * FROM products ", function (err, response) {
        if (err) throw err;
        // console.log("queryAllItems : " + response)
        for (var i = 0; i < response.length; i++) {
            console.log("\n" + `Item Id: ${response[i].item_id} , Product Name : ${response[i].product_name}, Department: ${response[i].department_name}, Price: ${response[i].price}, In Stock: ${response[i].stock_quantity}`);
        }

    })
    checkOrderAvailability();
}

// 2. If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

function queryLowInventory() {

    var query = "SELECT * FROM products WHERE stock_quantity < 5"

    connection.query(query, function (err, response) {
        for (var i = 0; i < response.length; i++) {
            console.log("\n" + `Product Name : ${response[i].product_name}`);
        }
    })
    checkOrderAvailability();
}

// 3. If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function userAddMore() {
    inquirer.prompt([
        {
            name: "itemId",
            type: "input",
            message: "Enter the item_id to add more of any item in the store: "
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter the quantity to add more of any item in the store: "
        },
    ]).then(function (err, res) {
        if (err) throw err;
        queryAddInventory(res.itemId, res.quantity);
        console.log("I am called");
    })
}


function queryAddInventory(itemId, quantity) {
    console.log("I am called");
    var query = "UPDATE products SET ? WHERE ?";
    var querySelect = "SELECT stock_quantity FROM products WHERE ?";
    connection.query(querySelect, [
        {
            item_id: itemId
        }
    ], function (error, response) {
        if (error) throw error;
        console.log("Initial value" + response[0].stock_quantity);
        var currStockQuantity = response[0].stock_quantity;
        var finalStockQuantity = currStockQuantity + quantity;
        connection.query(query, [
            {
                stock_quantity: finalStockQuantity,
            },
            {
                item_id: itemId
            }
        ], function (error, response) {
            if (error) throw error;
            // console.log("Successful update" + response[0].stock_quantity);

        });
    })
    // checkOrderAvailability()
}

// 4. If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function userAddInventory() {
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "Enter product name: "
        },
        {
            name: "department_name",
            type: "input",
            message: "Enter department: "
        },
        {
            name: "price",
            type: "input",
            message: "Enter the price: "
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "Enter the quantity: "
        }
    ]).then(function (response) {
        queryAddNew(response);
    })
}


function queryAddNew(userInput) {
    var query = "INSERT INTO products SET ?";

    connection.query(query, [
        {
            item_id: userInput.item_id,
            product_name: userInput.product_name,
            department_name: userInput.department_name,
            price: userInput.price,
            stock_quantity: userInput.stock_quantity
        }
    ], function (err, response) {
        if (err) throw err;
        console.log(response);
    })
    checkOrderAvailability();
}


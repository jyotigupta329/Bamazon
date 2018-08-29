var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var flag = true;

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
if (flag === true) {
    function checkOrderAvailability() {
        inquirer.prompt([
            {
                name: "orderId",
                type: "rawlist",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
                message: "Select from below options"

            }
        ]).then(function (response) {
            if (response.orderId === "View Products for Sale") {
                queryAllItems();
            }
            else if (response.orderId === "View Low Inventory") {
                queryLowInventory();

            } else if (response.orderId === "Add to Inventory") {
                userAddMore();
            } else if (response.orderId === "Add New Product") {
                userAddInventory();
            } else if (response.orderId === "Exit") {
                flag = false;
                console.log("Thank you !!");
            }
        })
    }
}


// 1. Display all items in the store

function queryAllItems() {
    connection.query("SELECT * FROM products ", function (err, response) {
        if (err) throw err;
        console.log("\n");
        var table = new Table();
        table.push([`\nItem Id`, `\nProduct Name`, `\nDepartment`, `\nPrice`, `\nIn Stock`])

        for (var i = 0; i < response.length; i++) {
            table.push([response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]);
        }
        console.log(table.toString());
        checkOrderAvailability();
    })

}

// 2. If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

function queryLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5"
    connection.query(query, function (err, response) {
        console.log("\n");
        var table = new Table();
        table.push([`\nItem Id`, `\nProduct Name`, `\nDepartment`, `\nPrice`, `\nIn Stock`])
        for (var i = 0; i < response.length; i++) {
            table.push([response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]);
        }
        console.log(table.toString());
        checkOrderAvailability();
    })

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
    ]).then(function (res) {
        queryAddInventory(res.itemId, res.quantity);
    })
}


function queryAddInventory(itemId, quantity) {
    var query = "UPDATE products SET ? WHERE ?";
    var querySelect = "SELECT * FROM products WHERE ?";
    connection.query(querySelect, [
        {
            item_id: itemId
        }
    ], function (error, response) {
        if (error) throw error;
        var currStockQuantity = parseInt(response[0].stock_quantity);
        var finalStockQuantity = parseInt(currStockQuantity) + parseInt(quantity);
        connection.query(query, [
            {
                stock_quantity: finalStockQuantity,
            },
            {
                item_id: itemId
            }
        ], function (error, response) {
            if (error) throw error;
            console.log("Stock was updated sucessfully!!")
            queryAllItems();
            checkOrderAvailability();
        });

    })
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
    ]).then(function (res) {
        queryAddNew(res.product_name, res.department_name, res.price, res.stock_quantity);
    })
}


function queryAddNew(product_name, department_name, price, stock_quantity) {
    var query = "INSERT INTO products SET ?";
    connection.query(query, [
        {
            // item_id: userInput.item_id,
            product_name: product_name,
            department_name: department_name,
            price: price,
            stock_quantity: stock_quantity
        }
    ], function (err, response) {
        if (err) throw err;
        console.log("Product added successfully!!\n");
        // queryAllItems();
        checkOrderAvailability();
    })

}


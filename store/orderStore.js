const orders = [];

function add(order) {
    orders.push(order);
    return order;
}

function getAll() {
    return [...orders];
}

function findById(id) {
    return orders.find((order) => order.id === id);
}

function removeById(id) {
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) return false;
    orders.splice(index, 1);
    return true;
}

module.exports = { add, getAll, findById, removeById };
const { randomUUID } = require("node:crypto");
const store = require("../store/orderStore");

const DEFAULT_ORDER_STATUS = "created";

function makeOrderId() {
    return `ord-${randomUUID().slice(0, 8)}`;
}

function roundMoney(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateTotal(items) {
    return roundMoney(
        items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    );
}

function normalizeItems(items) {
    return items.map((item) => ({
        name: item.name.trim(),
        quantity: item.quantity,
        price: item.price,
    }));
}

function isPositiveNumber(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function validateCreateOrder(body) {
    const problems = [];

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        problems.push("Request body must be a JSON object");
        return problems;
    }

    if (
        typeof body.customerName !== "string" ||
        body.customerName.trim().length === 0
    ) {
        problems.push("customerName is required");
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
        problems.push("At least one item is required");
        return problems;
    }

    body.items.forEach((item, index) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
            problems.push(`items[${index}] must be an object`);
            return;
        }

        if (typeof item.name !== "string" || item.name.trim().length === 0) {
            problems.push(`items[${index}].name is required`);
        }

        if (!isPositiveNumber(item.quantity)) {
            problems.push(`items[${index}].quantity must be greater than zero`);
        }

        if (!isPositiveNumber(item.price)) {
            problems.push(`items[${index}].price must be greater than zero`);
        }
    });

    return problems;
}

// Очікує вже провалідоване тіло запиту.
function createOrder(body) {
    const items = normalizeItems(body.items);

    return store.add({
        id: makeOrderId(),
        customerName: body.customerName.trim(),
        items,
        total: calculateTotal(items),
        status: DEFAULT_ORDER_STATUS,
        createdAt: new Date().toISOString(),
    });
}

function listOrders() {
    return store.getAll();
}

function getOrder(id) {
    return store.findById(id);
}

function deleteOrder(id) {
    return store.removeById(id);
}

module.exports = {
    validateCreateOrder,
    createOrder,
    listOrders,
    getOrder,
    deleteOrder,
};
export function onEnemieCollision(obj1, obj2) {
    return (
    obj1.x < obj2.x + obj2.w && obj1.x + obj1.w > obj2.x &&   // check width
    obj1.y < obj2.y + obj2.h && obj1.y + obj1.h > obj2.y    // check height
    );
}

export function onScoreCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.w && obj1.x + obj1.w > obj2.x;  // check width only
}
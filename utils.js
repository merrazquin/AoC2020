'use strict'

const TreeModel = require('tree-model')
const tree = new TreeModel()

/**
 * Converts data in the form of: 
 * {
 *   light_red: { bright_white: 1, muted_yellow: 2 },
 *   dark_orange: { bright_white: 3, muted_yellow: 4 },
 *   bright_white: { shiny_gold: 1 },
 *   muted_yellow: { shiny_gold: 2, faded_blue: 9 },
 *   shiny_gold: { dark_olive: 1, vibrant_plum: 2 },
 *   dark_olive: { faded_blue: 3, dotted_black: 4 },
 *   vibrant_plum: { faded_blue: 5, dotted_black: 6 },
 *   faded_blue: 0,
 *   dotted_black: 0
 * }
 * into a tree
 * @param {*} data 
 * @param {*} parentNode - node's parent
 * @param {string} name - node label
 * @param {Number} count - number of times this node should be added to parents
 */
const parseTree = (data, parentNode, name, count) => {
    let node
    for(var i = 0; i < count; i++) {
        node = tree.parse({name, count, children: []})
        const children = data[name]
        if (children) {
            for (const child in children) {
                parseTree(data, node, child, children[child])
            }
        }

        // Add this child to all instances of its parent type
        parentNode.all(foundParentNode => foundParentNode.model.name === parentNode.model.name)
            .forEach(foundParentNode => foundParentNode.addChild(node))
    }
    return node
}

/**
 * Vector difference
 * @param {{x:Number, y:Number}} pointA 
 * @param {{x:Number, y:Number}} pointB 
 * @returns {{x:Number, y:Number}} pointB - pointA
 */
const vectorDifference = (pointA, pointB) => {
    return {
        x: pointB.x - pointA.x,
        y: pointB.y - pointA.y
    }
}

/**
 * Rotates `point` around `axis` `degrees` counter-clockwise (in 90-degree increments)
 * Assumes "north" is negative
 * @param {{x: Number, y:Number}}  point 
 * @param {{x: Number, y:Number}}  axis 
 * @param {Number} degrees 
 * @returns {{x: Number, y:Number}} rotated point
 */
const rotatePointAroundAxisCounterClockwise = (point, axis, degrees) => {
    if (degrees % 90 != 0) {
        throw new Error(`${degrees} must be a multiple of 90`)
    }
    let offsets = vectorDifference(axis, point)
    let rotated = offsets
    while (degrees > 0) {
        rotated = {
            x: offsets.y ,
            y: offsets.x* -1
        }
        offsets = rotated
        degrees -= 90
    }
    const newPoint = {
        x: axis.x + rotated.x,
        y: axis.y + rotated.y
    }
    return newPoint
}

/**
 * Rotates `point` around `axis` `degrees` clockwise (in 90-degree increments)
 * Assumes "north" is negative
 * @param {{x: Number, y:Number}}  point 
 * @param {{x: Number, y:Number}}  axis 
 * @param {Number} degrees 
 * @returns {{x: Number, y:Number}} rotated point
 */
const rotatePointAroundAxisClockwise = (point, axis, degrees) => {
    if (degrees % 90 != 0) {
        throw new Error(`${degrees} must be a multiple of 90`)
    }
    let offsets = vectorDifference(axis, point)
    let rotated = offsets
    while (degrees > 0) {
        rotated = {
            x: offsets.y * -1,
            y: offsets.x
        }
        offsets = rotated
        degrees -= 90
    }
    const newPoint = {
        x: rotated.x + axis.x,
        y: rotated.y + axis.y
    }
    return newPoint
}
module.exports = { parseTree, rotatePointAroundAxisCounterClockwise, rotatePointAroundAxisClockwise }

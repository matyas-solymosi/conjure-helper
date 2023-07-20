var roptorCache = new Map()
var attackCache = new Map()
var advantageCache = []
var isFirstAttack = true
var isFirstConjure = true
class Animal {
    constructor(id, health) {
        this.id = id
        this.health = health
        this.advantage = true
    }

    attack() {
        return new Map()
    }
}

class Roptor extends Animal {
    constructor(id) {
        super(id, 10)
    }

    attack(withAdvantage) {
        var attacks = new Map()
        attacks.set('bite', this.bite(withAdvantage))
        attacks.set('claw', this.claw(withAdvantage))
        attackCache.set(this.id, attacks)
        console.log(this)
        console.log(attackCache)
        return attacks
    }

    bite(withAdvantage) {
        console.log("adv" + withAdvantage)
        var attackRolls = []
        if(withAdvantage) {
            for (let i = 0; i < 2; i++) {
                attackRolls.push(getRandomIntInclusive(1,20) + 4)
            }
        } else {
            attackRolls.push(getRandomIntInclusive(1,20) + 4)
        }
        var attackRoll = Math.max(...attackRolls)
        if(attackRoll == 24) {
            var damage = 6 + getRandomIntInclusive(1,6) + 2
        } else {
            var damage = getRandomIntInclusive(1,6) + 2
        }
        var attacks = new Map()
        attacks.set('attackRolls', attackRolls)
        attacks.set('damage', damage)
        return attacks
    }

    claw(withAdvantage) {
        var attackRolls = []
        if(withAdvantage) {
            for (let i = 0; i < 2; i++) {
                attackRolls.push(getRandomIntInclusive(1,20)+4)
            }
        } else {
            attackRolls.push(getRandomIntInclusive(1,20)+4)
        }
        var attackRoll = Math.max(...attackRolls)
        if(attackRoll == 24) {
            var damage = 4 + getRandomIntInclusive(1,4) + 2
        } else {
            var damage = getRandomIntInclusive(1,4) + 2
        } 
        var attacks = new Map()
        attacks.set('attackRolls', attackRolls)
        attacks.set('damage', damage)
        return attacks
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function attackWithAnimals() {
    var roptorCacheValuesArray = Array.from(roptorCache.values())
    console.log('ff' + roptorCacheValuesArray)
    for(let i = 0; i < roptorCacheValuesArray.length; i++) {
        console.log('e:' + roptorCacheValuesArray[i])
        roptorCacheValuesArray[i].attack(roptorCacheValuesArray[i].advantage)
    }
    updateTable()
    if(isFirstAttack) { isFirstAttack = false }

}

function conjure() {
    
    document.getElementById('attackButton').disabled = false
    console.log(animalCount)
    var animalCount = document.getElementById('conjureCount').value

    if(!isFirstConjure) {
        if (confirm("Biztos új állatokat akarsz idézni?")) { return }
    }
    
    roptorCache = new Map()
    for (let i = 0; i < animalCount; i++) {
        uuid = crypto.randomUUID()
        roptorCache.set(uuid, new Roptor(uuid))
    }

    updateTable()

    isFirstAttack = true
    isFirstConjure = false
    console.log('gee' + isFirstConjure)
}



function createTable(rowCount) {
    var headers = ["ID", "Health", "Advantage", "Attack Type", "Attack Roll(s)", "Damage"]
    var table = document.createElement('table')
    table.className = "styled-table"
    table.id = "conjureTable"

    for (let i = 0; i < rowCount; i++) {
        var row = table.insertRow(i)

        row.insertCell(0).id = "id#" + i
        row.insertCell(1).id = "health#" + i
        row.insertCell(2).id = "advantage#" + i
        row.insertCell(3).id = "attackType#" + i
        row.insertCell(4).id = "attackRoll#" + i
        row.insertCell(5).id = "damage#" + i

        var checkbox = document.createElement("INPUT")
        checkbox.type = "checkbox"
        checkbox.checked =  Array.from(roptorCache.values())[i].advantage
        checkbox.id = 'advantageCheckBox#' + i
        checkbox.onchange = function() {
            Array.from(roptorCache.values())[i].advantage = !Array.from(roptorCache.values())[i].advantage
        }
        var number = document.createElement("INPUT")
        number.type = 'number'
        number.min = 0
        
        row.cells[2].appendChild(checkbox)
        row.cells[1].appendChild(number)
    }

    var headerRow = table.createTHead().insertRow(0);
    for (let i = 0; i < headers.length; i++) {
        headerRow.insertCell(i).innerHTML = headers[i]
    }

    document.body.appendChild(table)
}

function checkDeath(id, index) {
    Array.from(roptorCache.values())[index].health = document.getElementById(id).value
    console.log(document.getElementById(id).value)
    console.log(index)
    if(document.getElementById(id).value == 0) {
        console.log("trigger");
        console.log(roptorCache)
        roptorCache.delete(id)
        console.log(roptorCache)
        isFirstAttack = true
    }
    updateTable()
    console.log(roptorCache)
}

function updateTable() {
    if (!isFirstConjure) {
        document.getElementById('conjureTable').remove()
    }
    isFirstConjure = false
    var roptorCacheValuesArray = Array.from(roptorCache.values())

    createTable(roptorCacheValuesArray.length)

    table = document.getElementById('conjureTable')

    console.log('len: ' + roptorCacheValuesArray.length)

    for (let i = 0; i < roptorCacheValuesArray.length; i++) {
        number = table.rows[i+1].cells[1].children[0]
        number.value = roptorCacheValuesArray[i].health
        number.id = roptorCacheValuesArray[i].id
        number.onchange = function() {
            checkDeath(roptorCacheValuesArray[i].id,i)
        }

        table.rows[i+1].cells[0].innerHTML = roptorCacheValuesArray[i].id
        table.rows[i+1].cells[1].children[0] = number

    }

    console.log('lennn' + roptorCacheValuesArray.length)
    for(let i = 0; i < roptorCacheValuesArray.length; i++) {
        attackTypeTable = document.createElement('table')
        attackRollTable = document.createElement('table')
        damageTable = document.createElement('table')

        for (const [key, value] of attackCache.get(roptorCacheValuesArray[i].id).entries()) {
            var attackTypeRow = attackTypeTable.insertRow()
            var attackRollRow = attackRollTable.insertRow()
            var damageRow = damageTable.insertRow()
            
            attackTypeRow.insertCell().id = 'attack' + key + i + 0
            attackTypeRow.cells[0].innerHTML = key

            attackRollRow.insertCell().id = 'attack' + key + i + 1
            attackRollRow.cells[0].innerHTML = value.get('attackRolls')

            damageRow.insertCell().id = 'attack' + key + i + 2
            damageRow.cells[0].innerHTML = value.get('damage')
            
        }

        document.getElementById("attackType#"+i).appendChild(attackTypeTable);
        document.getElementById("attackRoll#"+i).appendChild(attackRollTable);
        document.getElementById("damage#"+i).appendChild(damageTable);
    } 
    console.log(roptorCache)
}
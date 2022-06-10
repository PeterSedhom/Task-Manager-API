const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth') 
const router = new express.Router()


router.post('/tasks', auth, async (req,res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

//GET /tasks?completed=true
//GET /tasks?limit=2&skip=0  
//GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req,res) => {
    try {
        var tasks
        var limit = req.query.limit
        var skip = req.query.skip
        const sort ={}
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 
        }
        req.query.completed? tasks = await Task.find({owner: req.user._id , completed: req.query.completed}).limit(limit).skip(skip).sort(sort) : tasks = await Task.find({owner: req.user._id}).limit(limit).skip(skip).sort(sort)
        res.send(tasks)
        // await req.user.populate('tasks').execPopulate()
        // res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id})

        if(!task)
            res.status(404).send()
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req,res) => {
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValid){
        res.status(400).send({error:'Update not allowed!'})
    }

    try {
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    
        if(!task){
            res.status(404).send()
        }
    
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req,res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})

        if(!task)
            res.status(404).send()
        res.send(task)
    } catch (error) {
        res.status(500).send( )
    }
})


module.exports = router
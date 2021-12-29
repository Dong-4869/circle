package com.chen.circle.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.chen.circle.entity.*;
import com.chen.circle.service.CircleService;
import com.chen.circle.service.CommentService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author chen
 * @since 2021-11-14
 */
@RestController
@RequestMapping("/circle/circle")
public class CircleController {
    
    @Autowired
    private CircleService circleService;
    
    @Autowired
    private CommentService commentService;


    @GetMapping("")
    public R getAll(){
        List<Circle> circles = circleService.list(
                new QueryWrapper<Circle>().orderByDesc("create_time"));
        List<CircleVo> circleVos = new ArrayList<>();
        for (Circle circle : circles) {
            CircleVo circleVo = new CircleVo();
            BeanUtils.copyProperties(circle,circleVo);
            circleVo.setComments(commentService.list(
                    new QueryWrapper<Comment>().eq("circle_id",circleVo.getId())));
            circleVos.add(circleVo);
        }
        return R.ok().data("circles",circleVos);
    }

    @GetMapping("/{id}")
    public R getById(@PathVariable Integer id){
        Circle circle = circleService.getById(id);
        CircleVo circleVo = new CircleVo();
        BeanUtils.copyProperties(circle,circleVo);
        circleVo.setComments(commentService.list(
                new QueryWrapper<Comment>().eq("circle_id",circleVo.getId())));
        return R.ok().data("circle",circleVo);
    }

    @PostMapping("")
    public R saveOrUpdate(@RequestBody Circle circle){
        circleService.saveOrUpdate(circle);
        return R.ok();
    }
}


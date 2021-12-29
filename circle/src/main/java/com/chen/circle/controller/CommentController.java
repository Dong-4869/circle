package com.chen.circle.controller;


import com.chen.circle.entity.Comment;
import com.chen.circle.entity.R;
import com.chen.circle.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author chen
 * @since 2021-11-14
 */
@RestController
@RequestMapping("/circle/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("save")
    public R save(@RequestBody Comment comment){
        commentService.save(comment);
        return R.ok();
    }

}


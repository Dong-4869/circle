package com.chen.circle.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.chen.circle.entity.R;
import com.chen.circle.entity.User;
import com.chen.circle.service.UserService;
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
@RequestMapping("/circle/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("")
    public R save(@RequestBody User user){
        User one = userService.getOne(new QueryWrapper<User>()
                .eq("nick_name", user.getNickName()));
        if(one == null){
            userService.save(user);
        }else{
            userService.update(user,new UpdateWrapper<User>()
                    .eq("nick_name", user.getNickName()));
        }
        return R.ok();
    }

    @GetMapping("/{nickName}")
    public R getByNickName(@PathVariable String nickName){
        User user = userService.getOne(new QueryWrapper<User>()
                .eq("nick_name", nickName));
        return R.ok().data("user",user);
    }

}


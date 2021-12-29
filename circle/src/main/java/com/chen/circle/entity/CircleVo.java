package com.chen.circle.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * <p>
 * 
 * </p>
 *
 * @author chen
 * @since 2021-11-14
 */
@Data
public class CircleVo implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 昵称
     */
    private String nickName;

    /**
     * 头像
     */
    private String avatarUrl;

    /**
     * 图片
     */
    @JsonRawValue//可解析出无转义符号的JSON
    private String images;

    /**
     * 内容
     */
    private String content;

    /**
     * 点赞名单
     */
    private String zans;

    /**
     * 位置
     */
    private String address;

    /**
     * 评论列表
     */
    private List<Comment> comments;

    /**
     * 创建时间
     */
    private Date createTime;


}

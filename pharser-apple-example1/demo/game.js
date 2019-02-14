// 实际应用场景改为window.innerWidth和window.innerHeight。
// 这里是为了方便查看示例。
var width = window.innerWidth;;
var height = window.innerHeight;

// 创建游戏实例
var game = new Phaser.Game(width, height, Phaser.CANVAS, '#game');

// 定义场景
var states = {
    // 加载场景
    preload: function () {
        this.preload = function () {
            /*  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; */
            /*  game.world.setBounds(0, 0, width, height); */
            // 设置背景为黑色
            game.stage.backgroundColor = '#000000';
            // 加载游戏资源
            game.load.crossOrigin = 'anonymous'; // 设置跨域
            game.load.image('ground', '//peiwan.bs2dl-ssl.huanjuyun.com/da38bffbb5954779887ad623c5cc2b10.png');
            game.load.image('bg', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/bg.png');
            game.load.image('dude', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/dude.png');
            game.load.image('green', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/green.png');
            game.load.image('red', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/red.png');
            game.load.image('yellow', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/yellow.png');
            game.load.image('bomb', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/bomb.png');
            game.load.image('five', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/five.png');
            game.load.image('three', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/three.png');
            game.load.image('one', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/one.png');
            game.load.audio('bgMusic', '//24haowan-cdn.shanyougame.com/pickApple2/assets/audio/bgMusic.mp3');
            game.load.audio('scoreMusic', '//24haowan-cdn.shanyougame.com/pickApple2/assets/audio/addscore.mp3');
            game.load.audio('bombMusic', '//24haowan-cdn.shanyougame.com/pickApple2/assets/audio/boom.mp3');
            // 添加进度文字
            var progressText = game.add.text(game.world.centerX, game.world.centerY, '0%', {
                fontSize: '60px',
                fill: '#ffffff'
            });
            progressText.anchor.setTo(0.5, 0.5);
            // 监听加载完一个文件的事件
            game.load.onFileComplete.add(function (progress) {
                progressText.text = progress + '%';
            });
            // 监听加载完毕事件
            game.load.onLoadComplete.add(onLoad);
            // 最小展示时间，示例为3秒
            var deadLine = false;
            setTimeout(function () {
                deadLine = true;
            }, 3000);
            // 加载完毕回调方法
            function onLoad() {
                /*  if (deadLine) { */
                // 已到达最小展示时间，可以进入下一个场景
                game.state.start('created');
                /*   } else {
                      // 还没有到最小展示时间，1秒后重试
                      setTimeout(onLoad, 1000);
                  } */
            }
        }
    },
    // 开始场景
    created: function () {
        this.create = function () {
            // 添加背景
            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // 添加标题
            var title = game.add.text(game.world.centerX, game.world.height * 0.25, '小恐龙接苹果', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);
            // 添加提示
            var remind = game.add.text(game.world.centerX, game.world.centerY, '点击任意位置开始', {
                fontSize: '20px',
                fill: '#f2bb15'
            });
            remind.anchor.setTo(0.5, 0.5);
            // 添加主角
            var man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude');
            var manImage = game.cache.getImage('dude');
            man.width = game.world.width * 0.2;
            man.height = man.width / manImage.width * manImage.height;
            man.anchor.setTo(0.5, 0.5);

            var platforms = game.add.sprite(game.world.centerX, game.world.height * 0.84, 'ground');
            var groundImg = game.cache.getImage('ground');
            platforms.width = game.world.width;
            platforms.height = platforms.width / groundImg.width * groundImg.height;
            platforms.anchor.setTo(0.5, 0);

            // 添加点击事件
            game.input.onTap.add(function () {
                game.state.start('play');
            });
        }
    },
    // 游戏场景
    play: function () {
        var man; // 主角
        var apples; // 苹果
        var score = 0; // 得分
        var title; // 分数
        var scoreMusic;
        var bombMusic;
        var bgMusic;
        var platforms; //地面
        var gameTime = 0;
        var loopTime = 1500;
        var appleTimeInterval = 0;
        var lastAppleX = 0; //上一个苹果出现的x坐标
        var lastType; //记录上一个掉落的type
        this.create = function () {
                // 开启物理引擎
                game.physics.startSystem(Phaser.Physics.Arcade);
                game.physics.arcade.gravity.y = 300; // 全局设置默认重力为300
                // 添加背景音乐
                bgMusic = game.add.audio('bgMusic');
                bgMusic.loopFull();
                // 缓存其他音乐
                scoreMusic = game.add.audio('scoreMusic');
                bombMusic = game.add.audio('bombMusic');
                // 添加背景
                var bg = game.add.image(0, 0, 'bg');
                bg.width = game.world.width;
                bg.height = game.world.height;
                // 添加主角
                man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude');
                var manImage = game.cache.getImage('dude');
                man.width = game.world.width * 0.2;
                man.height = man.width / manImage.width * manImage.height;
                man.anchor.setTo(0.5, 0.5);
                // 添加分数
                title = game.add.text(game.world.centerX, game.world.height * 0.25, '0', {
                    font: 'bold 60px Helvetica',
                    fill: '#f2bb15'
                });
                title.anchor.setTo(0.5, 0.5);

                // 是否正在触摸
                var touching = false;
                // 监听按下事件
                game.input.onDown.add(function (pointer) {
                    if (Math.abs(pointer.x - man.x) < man.width / 2) touching = true;
                });
                // 监听离开事件
                game.input.onUp.add(function () {
                    touching = false;
                });
                // 监听滑动事件
                game.input.addMoveCallback(function (pointer, x, y, isTap) {
                    if (!isTap && touching) man.x = x;
                });
                game.physics.enable(man); // 加入物理运动
                man.body.allowGravity = false; // 清除重力影响
                man.body.collideWorldBounds = true;
                man.body.bounce.set(0.3);


                //添加苹果组
                apples = game.add.group();
                //苹果类型
                var appleTypes = ['green', 'red', 'yellow', 'bomb'];
                var appleTimer = game.time.create(true);
                game.time.events.add(loopTime, appleDown, this);

                function appleDown() {
                    var appleWidth = game.world.width / 8;
                    var x = Math.random() * game.world.width;
                    var type = appleTypes[weightedRand({
                        0: 0.4,
                        1: 0.2,
                        2: 0.1,
                        3: 0.3
                    })];

                    if (type !== lastType) {
                        console.log('different type')
                        var twoDistance = Math.abs(lastAppleX - x);
                        console.log('间隔:' + twoDistance)
                        if (twoDistance < appleWidth) {
                            console.log('间隔太小')
                            appleDown();
                            return;
                        }
                    }
                    var apple = apples.create(x, 0, type);
                    lastAppleX = x; //记录上一个x                   
                    apple.type = type;
                    lastType = apple.type;
                    // 设置苹果大小
                    var appleImg = game.cache.getImage(type);
                    apple.width = appleWidth;
                    apple.height = apple.width / appleImg.width * appleImg.height;
                    // 设置苹果加入物理运动
                    game.physics.enable(apple);
                    //设置苹果与游戏边缘碰撞
                    apple.body.collideWorldBounds = true;

                    appleTimeInterval = game.time.totalElapsedSeconds();
                    if (appleTimeInterval > 10 && appleTimeInterval < 20) {
                        loopTime = 1000;
                    } else if (appleTimeInterval > 20) {
                        loopTime = 500;
                    }
                    console.log(loopTime)
                    game.time.events.add(loopTime, appleDown, this);


                }

                //地面 
                platforms = game.add.sprite(game.world.centerX, game.world.height * 0.84, 'ground');
                var groundImg = game.cache.getImage('ground');
                platforms.width = game.world.width;
                platforms.height = platforms.width / groundImg.width * groundImg.height;
                platforms.anchor.setTo(0.5, 0);
                game.physics.enable(platforms);
                /*  platforms.body.immovable = true;  */
                platforms.body.allowGravity = false;

            },
            this.render = function () {
                /*  game.debug.body(platforms); */
            },
            this.update = function () {
                // 监听接触事件
                /* game.physics.arcade.collide(platforms, apples);  */

                game.physics.arcade.overlap(platforms, apples, failgame, null, this);
                game.physics.arcade.overlap(man, apples, pickApple, null, this); //只支持AABB（矩形）之间的碰撞检测(sprite1,sprite2,function())


            }

        function weightedRand(spec) {
            var i, sum = 0,
                r = Math.random();
            for (i in spec) {
                sum += spec[i];
                if (r <= sum) return i;
            }
        }
        weightedRand({
            0: 0.4,
            1: 0.2,
            2: 0.1,
            3: 0.3
        });

        function failgame(platforms, apple) {
            console.log(apple.type)
            apple.kill();
            if (apple.type !== 'bomb') game.state.start('over', true, false, score);
        }
        // 接触事件
        function pickApple(man, apple) {
            console.log(apple.type);
            if (apple.type === 'bomb') {
                // 播放音效
                bombMusic.play();
                game.state.start('over', true, false, score);
            } else {
                var point = 1;
                var img = 'one';
                if (apple.type === 'red') {
                    point = 3;
                    img = 'three';
                } else if (apple.type === 'yellow') {
                    point = 5;
                    img = 'five';
                }
                // 添加得分图片
                var goal = game.add.image(apple.x, apple.y, img);
                var goalImg = game.cache.getImage(img);
                goal.width = apple.width;
                goal.height = goal.width / (goalImg.width / goalImg.height);
                goal.alpha = 0;
                // 添加过渡效果
                var showTween = game.add.tween(goal).to({
                    alpha: 1,
                    y: goal.y - 20
                }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
                showTween.onComplete.add(function () {
                    var hideTween = game.add.tween(goal).to({
                        alpha: 0,
                        y: goal.y - 20
                    }, 100, Phaser.Easing.Linear.None, true, 200, 0, false);
                    hideTween.onComplete.add(function () {
                        goal.kill();
                    });
                });
                // 更新分数
                score += point;
                title.text = score;
                // 清除苹果
                apple.kill();
                // 播放音效
                scoreMusic.play();
            }
        }
    },

    // 结束场景
    over: function () {
        var score = 0;
        this.init = function () {
            score = arguments[0];
        }
        this.create = function () {
            // 添加背景
            var bg = game.add.image(0, 0, 'bg');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
            bg.width = game.world.width;
            bg.height = game.world.height;
            // 添加文本
            var title = game.add.text(game.world.centerX, game.world.height * 0.25, '游戏结束', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);
            var scoreStr = '你的得分是：' + score + '分';
            var scoreText = game.add.text(game.world.centerX, game.world.height * 0.4, scoreStr, {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });                                                                                    
            scoreText.anchor.setTo(0.5, 0.5);
            var remind = game.add.text(game.world.centerX, game.world.height * 0.6, '点击任意位置再玩一次', {
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            remind.anchor.setTo(0.5, 0.5);
            // 添加点击事件
            game.input.onTap.add(function () {
                game.state.start('play');
            });
        }
    }
};

// 添加场景到游戏示例中
Object.keys(states).map(function (key) {
    game.state.add(key, states[key]);
});

// 启动游戏
game.state.start('preload');
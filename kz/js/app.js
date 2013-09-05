
//enchant.js本体やクラスをエクスポートする
enchant();

window.addEventListener("DOMContentLoaded", function(){

  //ゲームオブジェクトを生成
  //enchant.Core(width, height)
  var core = new Core();  //引数で画面サイズを指定する
  core.fps = 16;                  //フレームレートを指定
  core.score = 0;
  core.time = 0;
  core.life = 3;
  core.preload('img/chara0.png', 'img/flowers.png', 'img/piece.png', 'img/map1.png');  //ゲーム内で使用するファイルを読み込む

  //localstrageを有効にする
  //9leapのデータベスに保存する場合はfalseにする
  enchant.nineleap.memory.LocalStorage.DEBUG_MODE = true;

  //ゲームのIDを設定する
  // 9leapのデータベースに保存する場合は
  // 9leapのゲームIDを設定する
  enchant.nineleap.memory.LocalStorage.GAME_ID = 'sample001';

  //自分音データを読み込む
  core.memory.player.preload();

  /**
   * Coin Class
   * @type {*}
   */
  var Coin = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y) {
      enchant.Sprite.call(this, 32, 32);
      this.x = x;
      this.y = y;
      this.image = core.assets['img/piece.png'];
      this.tick = 0;
      this.anime = [8, 9, 10, 11];
      this.addEventListener('enterframe', function() {
        if ( this.tick <= 8) {
          this.frame = this.tick;
        } else {
          this.frame = this.anime[this.tick % 4];
        }
        this.tick++;
      }, false);
    }
  });

  /**
   * Player Class
   * @type {*}
   */
  var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, map) {
      enchant.Sprite.call(this, 32, 32);
      this.image = core.assets['img/chara0.png'];
      this.frame = 0;
      this.x = x;
      this.y = y;
      this.tick = 0;
      this.hp = 1000;

      //【entergrame】イベントが発火したときに実行するリスナを登録する
      this.addEventListener('enterframe', function(e) {

        if (core.input.left) {
          this.x -= 4;
          //判定処理
          if (map.hitTest(this.x + 16, this.y + 30)) {
            this.x += 4;
          }
          //スプライトのフレーム番号を切り替える
          this.frame = this.tick % 3 + 9;
          // フレーム数をインクリメントする
          this.tick++;
        }
        if (core.input.right) {
          this.x += 4;
          //判定処理
          if (map.hitTest(this.x + 16, this.y + 30)) {
            this.x -= 4;
          }
          this.frame = this.tick % 3 + 18;
          this.tick++;
        }
        if (core.input.up) {
          this.y -= 4;
          //判定処理
          if (map.hitTest(this.x + 16, this.y + 30)) {
            this.y += 4;
          }
          this.frame = this.tick % 3 + 27 ;
          this.tick++;
        }
        if (core.input.down) {
          this.y += 4;
          //判定処理
          if (map.hitTest(this.x + 16, this.y + 30)) {
            this.y -= 4;
          }
          this.frame = this.tick % 3 ;
          this.tick++;
        }
      }, false);

      this.addEventListener('touchmove', function(e) {
        console.log('touchmove');
        this.x = e.x - this.width / 2;
        this.y = e.y - this.height / 2;
      }, false);

    }
  });

  core.addEventListener("load", function() {


    //メモリの初期化
     if (core.memory.player.data.score == null) {
       core.memory.player.data.score = core.score;
     }
    if (core.memory.player.data.life == null) {
      core.memory.player.data.life = core.life;
    }


    //データを復元(読み込んだデータを代入する)
    core.score = core.memory.player.data.score;
    core.life = core.memory.player.data.life;

    /**
     * マップを生成
     * @type {Map}
     */
    var map = new Map(16, 16);
    map.image = core.assets['img/map1.png'];
    // マップデータ(タイルの並びを表す2次元配列)
    map.loadData([
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,83,84,84,84,84,84,84,84,84,84,84,84],
      [1,1,1,1,1,1,1,1,99,100,116,116,116,116,116,116,116,116,116,116],
      [1,1,1,1,1,16,17,18,99,101,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,32,33,34,99,101,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,48,49,50,99,101,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,99,101,1,1,1,1,1,20,20,1,1,1],
      [1,1,1,1,1,1,1,1,99,101,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,99,101,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,99,101,1,1,16,18,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,99,101,1,1,48,50,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,99,101,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,99,101,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,99,101,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,99,101,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,99,101,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,99,101,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,99,101,1,1,1,1,1,1,1,1,1,1]
    ],
      [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,23,23,23,23,23,23,-1,-1,-1],
        [-1,23,23,23,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1],
        [-1,-1,-1,-1,23,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1],
        [-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
      ]);
    // マップの当たり判定データ(タイルが当たり判定を持つかを表す2次元配列)
    map.collisionData = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0],
      [0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    // rootSceneにマップを追加する
    core.rootScene.addChild(map);

    /**
     * バーチャルパッドを作成する
     * @type {Pad}
     */
    var pad = new Pad;
    pad.x = 220;
    pad.y = 220;
    core.rootScene.addChild(pad);

    //トラップを生成
    var trap = new Sprite(16, 16);
    trap.image = core.assets['img/map1.png'];
    trap.frame = 43;
    trap.x = 136;
    trap.y = 152;
    core.rootScene.addChild(trap);


    var player = new Player(120, 50, map);
    core.rootScene.addChild(player);

    /**
     * ラベルの作成
     */
    var infoLabel = new Label('enchant.jsサンプル');
    infoLabel.x = 16;
    infoLabel.y = 0;
    infoLabel.color = '#0000FF';
    infoLabel.font = '14px sens-serif';
    core.rootScene.addChild(infoLabel);


    //ライフラベルを作成
    var lifeLabel = new LifeLabel(180, 0, core.life);
    core.rootScene.addChild(lifeLabel);

    //セーブラベルの生成
    var savelabel = new MutableText(16, 320 -16);
    savelabel.addEventListener('touchstart', function(e) {
      this.backgroundColor = '#F0F0F0';
    }, false);
    savelabel.addEventListener('touchend', function(e) {
      this.backgroundColor = '';

      /**
       * データの保存処理
       */
        //ライフとスコアをメモリに書き込む
      core.memory.player.data.life = core.life;
      core.memory.player.data.score = core.score;
      //保存を実行する
      core.memory.update();

    }, false);
    core.rootScene.addChild(savelabel);



    core.rootScene.addEventListener('enterframe', function(e) {
      //プレイヤーの座標が300以上なら切り替える
      if (player.x > 300) {
        core.pushScene(core.field(player.x, player.y));
        //pop時のために少しだけ座標を戻しておく
        player.x = 280;
      }

      //トラップにあたったら
      if (player.within(trap, 30)) {
        //ライフを減、表示を更新
        console.log(lifeLabel.life)
        lifeLabel.life = -- core.life;
        //プレイヤーは初期位置に移動する
        player.x = 120;
        player.y = 50;
        //点滅表示する
        player.tl.fadeOut(1).fadeIn(5).fadeOut(1).fadeIn(5);
        if (core.life == 0) {
          player.tl.rotateBy(360, 30)
            .and().fadeOut(30).and().scaleTo(0.2, 30, enchant.Easing.BOUNCE_EASEINOUT)
            //10フレーム後にゲームオーバーの表示
            .cue({ 10 : function() {
              core.end();
            }});
        }
      }
      //セーブラベルの文字列をセットする
      savelabel.text = 'save';
    }, false);

    //新しいシーンを作成する関数
    core.field = function(px, py) {

      //新しいシーンを作成
      var scene = new Scene();

      //マップを作成する
      var map = new Map(16, 16);
      map.image = core.assets['img/map1.png'];
      map.loadData([
        [37,37,37,37,37,37,37,37,37,19,19,19,32,33,33,33,33,33,33,33],
        [37,37,37,37,37,37,37,37,37,20,20,20,48,49,49,49,49,49,49,49],
        [37,37,23,23,23,23,23,23,23,23,7,37,37,37,37,37,37,37,37,37],
        [84,84,84,84,84,84,84,84,84,84,7,37,37,37,37,37,37,37,37,37],
        [116,116,116,116,116,116,116,116,100,100,7,37,37,20,37,37,37,37,37,37],
        [37,37,23,23,23,23,23,7,100,100,7,37,37,37,37,37,37,37,37,37],
        [37,37,37,37,37,37,37,7,100,100,7,37,37,37,37,37,37,37,37,37],
        [37,37,37,37,37,37,37,7,100,100,7,37,37,37,37,37,37,37,37,37],
        [37,37,37,37,37,37,37,7,100,100,7,37,37,37,37,37,37,37,37,37],
        [37,37,37,37,37,37,37,7,100,100,23,23,23,23,23,23,23,23,37,37],
        [37,37,37,37,37,37,37,7,100,100,84,84,84,84,84,84,84,84,84,84],
        [37,37,37,23,23,23,23,23,100,100,116,116,116,116,116,116,116,116,116,116],
        [37,37,37,37,37,37,37,37,100,100,37,37,37,37,37,37,37,37,37,37],
        [37,37,37,37,37,37,37,37,100,100,37,37,37,37,37,37,37,37,37,37],
        [37,37,23,23,23,23,23,7,100,100,37,37,37,37,37,37,37,37,37,37],
        [37,37,37,37,37,37,37,7,100,100,37,37,37,37,37,37,37,37,37,37],
        [37,37,37,37,37,37,37,7,100,100,37,37,37,37,37,37,37,37,37,37],
        [37,37,37,37,37,37,37,7,100,100,37,37,37,37,37,37,37,37,37,37],
        [37,37,37,37,37,37,37,23,100,100,37,37,37,37,37,37,37,37,37,37],
        [37,37,37,37,37,37,37,37,100,100,37,37,37,37,37,37,37,37,37,37]
      ]);

      map.collisionData = [
        [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
        [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      ];

      //シーンにマップを追加
      scene.addChild(map);

      //コイン生成処理
      var coins = [];
      for ( var i = 0; i < 10; i++) {
        var coin = new Coin(128, 80 + 16 * i);
        scene.addChild(coin);
        coins[i] = coin;
      }


      //新たにプレイヤーを生成する
      var player = new Player(0, py, map);
      scene.addChild(player);

      var timeLabel = new TimeLabel(16, 304);
      timeLabel.time = core.time;
      scene.addChild(timeLabel);


      //スコアをフォントで表示する
      var scoreLabel = new ScoreLabel(16, 0);
      scoreLabel.score = core.score;
      scene.addChild(scoreLabel);
      scoreLabel.easing = 5;

      scene.addEventListener('enterframe', function(e) {
        if (player.x < -20){core.popScene();}

        core.time = timeLabel.time;


        //プレイヤーとコインの当たり判定
        for (var i in coins) {
          if (player.within(coins[i], 16)) {
            core.score = scoreLabel.score += 100;
            console.log(core.score);
            scene.removeChild(coins[i]);
            delete coins[i];
          }
        }
      }, false);


      /**
       * バーチャルパッドを作成する
       * @type {Pad}
       */
      var pad = new Pad;
      pad.x = 220;
      pad.y = 220;
      scene.addChild(pad);


      return scene;
    };

  }, false);

  core.start();

});
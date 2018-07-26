<template>
  <div class="map">
    <div id="allmap" />
    <div class="searchBar">
      <input
        v-model="address"
        type="text"
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      address: this.$route.query.address,
      hasBoundary: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.initMap();
    }, 20);
  },
  methods: {
    initMap() {
      // 百度地图API功能
      var map = new BMap.Map("allmap"); // 创建Map实例
      //map.centerAndZoom(this.address, 12);
      this.addControlMap(map);
      this.getGeocoder(map);
      this.getBoundaryMap(map);
    },
    addControlMap(map) {
      //添加地图类型控件
      var top_right_navigation = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL
      });
      map.addControl(top_right_navigation);
    },
    getGeocoder(map) {
      //地址解析
      var _this = this;
      var myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上,并调整地图视野
      myGeo.getPoint(this.address, function(point) {
        if (point) {
          console.log(point);
          if (!_this.hasBoundary) {
            map.centerAndZoom(point, 14);
          }
          map.addOverlay(new BMap.Marker(point));
        } else {
          alert("您选择地址没有解析到结果!");
        }
      });
    },
    getBoundaryMap(map) {
      var _this = this;
      var bdary = new BMap.Boundary();
      bdary.get(this.address, function(rs) {
        //获取行政区域
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
          _this.getGeocoder(map);
          return;
        }
        _this.hasBoundary = true;
        var pointArray = [];
        for (var i = 0; i < count; i++) {
          var ply = new BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 2,
            strokeColor: "#ff0000"
          }); //建立多边形覆盖物
          map.addOverlay(ply); //添加覆盖物
          pointArray = pointArray.concat(ply.getPath());
        }
        _this.getGeocoder(map);
        map.setViewport(pointArray); //调整视野
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.map
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 90

  #allmap
    width 100%
    height 100%

  .searchBar
    position absolute
    box-sizing border-box
    width 100%
    top 10px
    left 0
    right 0
    padding 10px 15px
    z-index 999

    input
      display block
      width 100%
      height 36px
      padding 0 20px
      border-radius 6px
      box-sizing border-box
      outline 0
      border 1px solid #bfcbd9
      transition 0.5s border-color
      appearance none

      &:focus
        border-color #20a0ff
</style>
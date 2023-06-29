var app = angular.module("myApp", ["ngRoute"]);
//1. CẤU HÌNH ROUTE
app.config(function($routeProvider){ 
    $routeProvider
    .when("/", {
        templateUrl: "Home.html",
        controller: "myCtrl"
    })
    
    .when("/products", {
        templateUrl: "Products.html",
        controller: "myCtrl"
    })
   
    .when("/aboutus", {
      templateUrl: "AboutUs.html",
      controller: "myCtrl"
    })

    .when("/contactus", {
        templateUrl: "ContactUs.html",
        controller: "myCtrl"
    })
});
    

// ----------------------------
//2. PHÁT TRIỂN CONTROLLER
app.controller('myCtrl', function($scope, $http){
    //2.1. Khai báo hàm đọc data từ file JSON (READ-R)
    function getData(){
        $http.get('DataBase.json')
        .then(function(response){
            if (sessionStorage.getItem("sesProducts")==null){
                // Ghi giá trị vào Session Storage
                sessionStorage.setItem("sesProducts", JSON.stringify(response.data.products));
                sessionStorage.setItem("sesCart", JSON.stringify(response.data.cart));
                sessionStorage.setItem("sesCategories", JSON.stringify(response.data.categories));
                sessionStorage.setItem("sesCount", JSON.stringify(response.data.countitem));
                // Đọc data từ Session Storage đổ vào biến
                $scope.productsList = JSON.parse(sessionStorage.getItem("sesProducts"));
                $scope.shoppingcart = JSON.parse(sessionStorage.getItem("sesCart"));
                $scope.categories = JSON.parse(sessionStorage.getItem("sesCategories"));
                $scope.count = JSON.parse(sessionStorage.getItem("sesCount"));
            } else {
                $scope.productsList = JSON.parse(sessionStorage.getItem("sesProducts"));
                $scope.shoppingcart = JSON.parse(sessionStorage.getItem("sesCart"));
                $scope.categories = JSON.parse(sessionStorage.getItem("sesCategories"));
                $scope.count = JSON.parse(sessionStorage.getItem("sesCount"));
            }
        })
    }
    //2.2. Gọi hàm getData để LOAD dữ liệu vào danh sách
    getData();

    
    
    var findItemById = function(items, id) {
        return _.find(items, function(item) {
          return item.id === id;
        });
      };

      $scope.getCost = function(item) {
        return item.qty * item.price;
      };

  
     

    $scope.addItem = function(itemToAdd) {
        var found = findItemById($scope.shoppingcart, itemToAdd.id);
        if (found) {
            found.qty += itemToAdd.qty;
            setStorage();
            getStorage();
            
        }
        else {
            $scope.shoppingcart.push(angular.copy(itemToAdd));
            $scope.count++;
            setStorage();
            getStorage();
          }
    };

      

      $scope.getTotal = function() {
        var total =  _.reduce($scope.shoppingcart, function(sum, item) {
          return sum + $scope.getCost(item);
        }, 0);
        console.log('total: ' + total);
        return total;
      };


      $scope.removeItem = function(item) {
        var index = $scope.shoppingcart.indexOf(item);
        $scope.shoppingcart.splice(index, 1);
        $scope.count -= 1;
        setStorage();
      };
      
      $scope.increaseQty = function(itemInCart) {
        itemInCart.qty += 1;
        setStorage()
        
      }

      $scope.decreaseQty = function(itemInCart) {
        if (itemInCart.qty ===1) {
          removeItem(itemInCart);
        } else {
          itemInCart.qty -= 1;
          setStorage()
        }
        
      }


      
      

      $scope.clearCart = function() {
        $scope.shoppingcart.length = 0;
        $scope.count = 0;
        setStorage();

      };

      function setStorage() {
        var data = JSON.stringify($scope.shoppingcart);
        sessionStorage.setItem("sesCart", data);
        var countdata = JSON.stringify($scope.count);
        sessionStorage.setItem("sesCount",countdata);  
    }

    $scope.getStorage = function() {
      $scope.shoppingcart = JSON.parse(sessionStorage.getItem("sesCart"));
      $scope.count = JSON.parse(sessionStorage.getItem("sesCount"));
    }


      $scope.getCat = function(category) {
        $scope.selectedCat = category;
        $scope.categoryTitle = category;
        console.log(selectedCat + categoryTitle);
      }

      $scope.filterCategory = function(item) {
        if ($scope.selectedCat=='ALL PRODUCTS') {
          $scope.selectedCat = '';
        } 
          return !$scope.selectedCat || item.category === $scope.selectedCat;       
      };

      $scope.searchProducts = function (item) {
        $scope.searchValue = item;
        
      };

      // window.onbeforeunload = function(){
      //   sessionStorage.removeItem("sesCart");
      //   sessionStorage.setItem('sesCount',0);
      // };
      
      
});


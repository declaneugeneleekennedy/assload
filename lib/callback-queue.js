
var CallbackQueue = (function($) {
    var queue = [];    
    
    var $t = function(promises) {
        if(promises) {
            $.each(promises, function(promise) {
                $t.add(promise);
            });
        }
    };
    
    $t.prototype.add = function(promise) {
        queue.push(promise);
    };
    
    $t.prototype.promise = function() {
        var settled = 0,
            $d      = $.Deferred();
       
        $.each(queue, function(i, callback) {
            $.when(callback()).always(function() {
                ++settled;
                
                if(settled >= queue.length) {
                    $d.resolve();
                }
            });
        });
        
        return $d.promise();
    };
        
    return $t;
})(jQuery);

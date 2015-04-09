
var AssLoad = (function($, CallbackQueue) {
    var queue = new CallbackQueue;
    
    function add(tag, attributes) {
        attributes['data-ass'] = 'on';
        
        var $d = $.Deferred();
        
        var $el = $(document.createElement(tag));
                
        $el.on('load', function() {            
            $d.resolve($el);
        });
        
        $el.on('error', function(e) {
            $d.reject(e);
        });
        
        var $p = $d.promise();
        
        queue.add(function() {
            $(document.body).append($el);
            $el.attr(attributes);
            
            return $p;
        });
        
        return $p;
    }
    
    var $t = function(tags) {
        if(tags) {
            $.each(tags, function(attributes, tag) {
                var $p = add(tag, attributes);
                
                queue.add($p);
            });
        }
    };
    
    $t.prototype.addScript = function(src) {
        return add('script', { src: src });
    };
    
    $t.prototype.addImage = function(src) {
        return add('img', { src: src });
    };
    
    $t.prototype.addCss = function(href) {
        return add('link', {
            href: href,
            rel: 'stylesheet'
        });
    };
    
    $t.prototype.promise = function() {
        var $p = queue.promise();
        
        $p.done(function() {
            $('[data-ass]').remove();
        });
        
        return $p;
    };
    
    return $t;
})(jQuery, CallbackQueue);
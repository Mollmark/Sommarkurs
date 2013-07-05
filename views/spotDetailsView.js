surfSpoter.spotDetailsView = Backbone.View.extend({
	
	render:function () {
	
        this.$el.html(this.template(this.model));

        console.log("this.model i vy ", this.model);
        console.log(this.template);
        return this;
    }
});
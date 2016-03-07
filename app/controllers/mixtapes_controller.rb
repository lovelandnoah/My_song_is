class MixtapesController < ApplicationController
  skip_before_filter :authenticate_user!, only: [:find_single_mixtape]

	def index
  end

	def create
		mixtape_name = params[:name]
		mixtape_category = params[:category]
		@mixtape = Mixtape.new
		@mixtape.user_id = current_user.id
		@mixtape.author_id = current_user.id
		@mixtape.name = mixtape_name
		@mixtape.category = mixtape_category
		@mixtape.save
		render json: @mixtape
	end

  def find_single_mixtape
     	mixtape_id =  params[:mixtape_id]
      @mixtape = Mixtape.find(mixtape_id)
      # @mixtape = Mixtape.where(user_id: current_user.id)
   #    @mixtape = Mixtape.where(user_id: current_user)
      
   #    if @mixtape.any?
   #  	@songs = Song.where(mixtape_id: @mixtape[0].id)
			# end

     


	end

  def users_mixtapes
  	 search_terms = params[:search_term]
  	if search_terms == 'all'
  		@mixtapes = Mixtape.all
    elsif search_terms == 'users'
      @mixtapes = Mixtape.where(user_id: current_user.id).order(created_at: :desc)
    elsif search_terms == 'highest_rated'
       @mixtapes.sort! {|a,b| a.average_rating <=> b.average_rating}
    end
  end

  def destroy
  	mixtape = Mixtape.find(params[:id])
		mixtape.destroy
		head :ok
  end

	private

		def mixtape_params
			params.require(:mixtape).permit(:name, :category, :author_id, :random, :user_id)
		end
end

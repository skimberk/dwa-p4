<?php

class RoomController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 * GET /room
	 *
	 * @return Response
	 */
	public function index()
	{
		$rooms = Room::all();
		return $rooms->toJson();
	}

	/**
	 * Show the form for creating a new resource.
	 * GET /room/create
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 * POST /room
	 *
	 * @return Response
	 */
	public function store()
	{
		$name = Input::get('name');

		if($name) {
			$room = new Room;
			$room->name = $name;
			$room->save();

			$redis = Redis::connection();
			$redis->publish('updates', 'rooms-changed');
		}
	}

	/**
	 * Display the specified resource.
	 * GET /room/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$room = Room::find($id);

		return $room->messages->toJson();
	}

	/**
	 * Show the form for editing the specified resource.
	 * GET /room/{id}/edit
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 * PUT /room/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		$name = Input::get('name');

		if($name) {
			$room = Room::find($id);
			$room->name = $name;
			$room->save();

			$redis = Redis::connection();
			$redis->publish('updates', 'rooms-changed');
		}
	}

	/**
	 * Remove the specified resource from storage.
	 * DELETE /room/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$room = Room::find($id);
		$room->delete();

		$redis = Redis::connection();
		$redis->publish('updates', 'rooms-changed');
	}

}

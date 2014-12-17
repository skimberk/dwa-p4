<?php

class MessageController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		// header('Content-Type: text/event-stream');
		// header('Cache-Control: no-cache');
		// header('Connection: keep-alive');

		// $redis = Redis::connection();

		// while(true) {
		// 	echo 'Hey!';
		// 	$redis->publish('messages', 'test');

		// 	ob_flush();
		// 	flush();

		// 	sleep(1);
		// }
	}


	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		$text = Input::get('text');
		$room = Input::get('room');

		if($text && $room) {
			// $room = new Room;
			// $room->name = "Another test room";
			// $room->save();

			$message = new Message;
			$message->text = $text;
			$message->room_id = $room;
			$message->save();

			$redis = Redis::connection();
			$redis->publish('updates', $message->id);
		}
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$message = Message::find($id);

		return $message->toJson();
	}


	/**
	 * Show the form for editing the specified resource.
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
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}

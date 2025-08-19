import React from 'react';
import { ChevronUp, ChevronDown, Edit3, Paperclip, Upload, ArrowLeft, Clock, CheckCircle2, Archive, X } from 'lucide-react';
import VisualEditor from '../VisualEditor';

type Section = 'today' | 'todo' | 'done';

export interface TaskItemProps {
	task: any;
	section: Section;
	colors: any;
	isExpanded: boolean;
	projectNames: string[];
	onToggleNotes: (taskId: number) => void;
	onMoveUp: (taskId: number, section: Section) => void;
	onMoveDown: (taskId: number, section: Section) => void;
	onUpdateText: (taskId: number, section: Section, text: string) => void;
	onUpdateNotes: (taskId: number, section: Section, notes: string) => void;
	onUpdateProject: (taskId: number, section: Section, projectName: string) => void;
	onAddTagToTask: (taskId: number, section: Section, tag: string) => void;
	onRemoveTagFromTask: (taskId: number, section: Section, tag: string) => void;
	onHandleFileUpload: (files: FileList | null, isNewTask: boolean, taskId: number, section: Section) => void;
	onRemoveFile: (fileId: number, isNewTask: boolean, taskId: number, section: Section) => void;
	onMoveTask: (taskId: number, fromSection: Section, toSection: Section) => void;
	onDeleteTask: (taskId: number, section: Section) => void;
	getAllTags: () => string[];
}

const TaskItem: React.FC<TaskItemProps> = ({
	task,
	section,
	colors,
	isExpanded,
	projectNames,
	onToggleNotes,
	onMoveUp,
	onMoveDown,
	onUpdateText,
	onUpdateNotes,
	onUpdateProject,
	onAddTagToTask,
	onRemoveTagFromTask,
	onHandleFileUpload,
	onRemoveFile,
	onMoveTask,
	onDeleteTask,
	getAllTags
}) => {
	const [editText, setEditText] = React.useState<string>(task.text || '');
	const [editNotes, setEditNotes] = React.useState<string>(task.notes || '');

	React.useEffect(() => {
		if (isExpanded) {
			setEditText(task.text || '');
			setEditNotes(task.notes || '');
		}
	}, [isExpanded, task.text, task.notes]);

	return (
		<div style={{ 
			backgroundColor: 'white',
			borderRadius: '12px',
			padding: '16px',
			marginBottom: '6px',
			border: `1px solid ${colors.border}`,
			transition: 'all 0.2s'
		}}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
				<div style={{ flex: 1 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
						{/* Стрелочки для изменения порядка */}
						<div style={{ 
							display: 'flex', 
							flexDirection: 'row', 
							gap: '1px', 
							marginRight: '8px',
							alignItems: 'center'
						}}>
							<button 
								onClick={() => onMoveUp(task.id, section)}
								style={{
									background: 'none',
									border: 'none',
									padding: '1px',
									cursor: 'pointer',
									borderRadius: '3px',
									transition: 'all 0.2s',
									opacity: 0.5,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									width: '16px',
									height: '16px'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = '#F0F0F0';
									e.currentTarget.style.opacity = '1';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = 'transparent';
									e.currentTarget.style.opacity = '0.5';
								}}
								title="Переместить вверх"
							>
								<ChevronUp size={10} color={colors.text.secondary} />
							</button>
							
							<button 
								onClick={() => onMoveDown(task.id, section)}
								style={{
									background: 'none',
									border: 'none',
									padding: '1px',
									cursor: 'pointer',
									borderRadius: '3px',
									transition: 'all 0.2s',
									opacity: 0.5,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									width: '16px',
									height: '16px'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = '#F0F0F0';
									e.currentTarget.style.opacity = '1';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = 'transparent';
									e.currentTarget.style.opacity = '0.5';
								}}
								title="Переместить вниз"
							>
								<ChevronDown size={10} color={colors.text.secondary} />
							</button>
						</div>
						
						<span
							onDoubleClick={() => onToggleNotes(task.id)}
							title="Редактировать"
							style={{ fontSize: '15px', fontWeight: '500', color: colors.text.primary, cursor: 'text' }}
						>
							{task.text}
						</span>
						
						{task.project && (
							<span style={{
								fontSize: '11px',
								padding: '3px 8px',
								borderRadius: '12px',
								backgroundColor: task.projectColor,
								color: colors.text.primary
							}}>
								{task.project}
							</span>
						)}
						
						{task.tags && task.tags.map((tag: string) => (
							<span key={tag} style={{
								fontSize: '11px',
								padding: '3px 6px',
								borderRadius: '12px',
								backgroundColor: colors.accent.todo + '40',
								color: colors.text.primary
							}}>
								#{tag}
							</span>
						))}
						
						<button 
							onClick={() => onToggleNotes(task.id)}
							title={isExpanded ? 'Свернуть' : 'Редактировать'}
							style={{
								background: 'none',
								border: 'none',
								padding: '3px',
								cursor: 'pointer',
								borderRadius: '6px'
							}}
						>
							<Edit3 size={12} color={colors.text.secondary} />
						</button>
					</div>
					
					{task.notes && !isExpanded && (
						<div style={{
							fontSize: '13px',
							marginTop: '6px',
							padding: '8px',
							borderRadius: '6px',
							backgroundColor: colors.background,
							color: colors.text.secondary,
							lineHeight: '1.4',
							whiteSpace: 'pre-wrap'
						}}
						dangerouslySetInnerHTML={{ __html: task.notes }}
						/>
					)}
					
					{task.files && task.files.length > 0 && !isExpanded && (
						<div style={{ marginTop: '6px', display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
							{task.files.map((file: any) => (
								<span key={file.id} style={{
									fontSize: '11px',
									padding: '3px 6px',
									borderRadius: '6px',
									backgroundColor: colors.background,
									color: colors.text.secondary,
									display: 'inline-flex',
									alignItems: 'center',
									gap: '3px'
								}}>
									<Paperclip size={10} />
									{file.name}
								</span>
							))}
						</div>
					)}
					
					{isExpanded && (
						<div className="task-expanded-container" style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${colors.border}` }}>
							<input
								value={editText}
								onChange={(e) => setEditText(e.target.value)}
								onBlur={() => onUpdateText(task.id, section, editText)}
								placeholder="Название задачи"
								style={{
									width: '100%',
									padding: '8px 10px',
									fontSize: '15px',
									borderRadius: '8px',
									border: `1px solid ${colors.border}`,
									marginBottom: '6px',
									outline: 'none'
								}}
							/>
							
							<VisualEditor
								value={editNotes}
								onChange={(value) => {
									setEditNotes(value);
								}}
								onBlur={() => onUpdateNotes(task.id, section, editNotes)}
								placeholder="Добавить заметки..."
							/>
							
							<div style={{ marginTop: '6px', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', maxWidth: '100%', overflowX: 'hidden' }}>
								<select 
									value={task.project || ''}
									onChange={(e) => onUpdateProject(task.id, section, e.target.value)}
									style={{
										fontSize: '11px',
										padding: '3px 6px',
										borderRadius: '12px',
										border: `1px solid ${colors.border}`,
										backgroundColor: 'white',
										cursor: 'pointer'
									}}
								>
									<option value="">+ Проект</option>
									{projectNames.map((name) => (
										<option key={name} value={name}>{name}</option>
									))}
								</select>
								
								<input
									type="file"
									id={`file-${task.id}`}
									multiple
									onChange={(e) => onHandleFileUpload(e.target.files, false, task.id, section)}
									style={{ display: 'none' }}
								/>
								<label
									htmlFor={`file-${task.id}`}
									style={{
										fontSize: '11px',
										padding: '3px 8px',
										borderRadius: '12px',
										backgroundColor: colors.accent.primary + '20',
										color: colors.text.primary,
										cursor: 'pointer',
										display: 'inline-flex',
										alignItems: 'center',
										gap: '3px'
									}}
								>
									<Upload size={10} />
									Файл
								</label>
								<select
									onChange={(e) => {
										if (e.target.value) {
											onAddTagToTask(task.id, section, e.target.value);
											e.target.value = '';
										}
									}}
									style={{
										fontSize: '11px',
										padding: '3px 6px',
										borderRadius: '12px',
										border: `1px solid ${colors.border}`,
										backgroundColor: 'white',
										cursor: 'pointer'
									}}
								>
									<option value="">+ Тег</option>
									{getAllTags().filter((tag: string) => !(task.tags || []).includes(tag)).map((tag: string) => (
										<option key={tag} value={tag}>#{tag}</option>
									))}
								</select>
							</div>

							{(task.tags && task.tags.length > 0) && (
								<div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
									{task.tags.map((tag: string) => (
										<span key={tag} style={{
											fontSize: '11px',
											padding: '3px 6px',
											borderRadius: '12px',
											backgroundColor: colors.accent.todo + '40',
											color: colors.text.primary,
											display: 'inline-flex',
											alignItems: 'center',
											gap: '3px'
										}}>
											#{tag}
											<button
												onClick={() => onRemoveTagFromTask(task.id, section, tag)}
												style={{
													background: 'none',
													border: 'none',
													padding: 0,
													cursor: 'pointer',
													display: 'flex'
												}}
											>
												<X size={8} color="#FF6B6B" />
											</button>
										</span>
									))}
								</div>
							)}
							
							{task.files && task.files.length > 0 && (
								<div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
									{task.files.map((file: any) => (
										<div key={file.id} style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											padding: '6px',
											borderRadius: '6px',
											backgroundColor: colors.background
										}}>
											<span style={{
												fontSize: '11px',
												color: colors.text.secondary,
												display: 'flex',
												alignItems: 'center',
												gap: '3px'
											}}>
												<Paperclip size={10} />
												{file.name}
											</span>
											<button
												onClick={() => onRemoveFile(file.id, false, task.id, section)}
												style={{
													background: 'none',
													border: 'none',
													padding: '3px',
													cursor: 'pointer'
											}}
											>
												<X size={10} color="#FF6B6B" />
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>

				<div style={{ display: 'flex', gap: '3px', marginLeft: '8px' }}>
					{section === 'today' && (
						<button 
							onClick={() => onMoveTask(task.id, section, 'todo')}
							style={{
								background: 'none',
								border: 'none',
								padding: '6px',
								cursor: 'pointer',
								borderRadius: '6px',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B8D4E820'; }}
							onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
							title="В планы"
						>
							<ArrowLeft size={14} color={colors.accent.todo} />
						</button>
					)}
					
					{section === 'todo' && (
						<button 
							onClick={() => onMoveTask(task.id, section, 'today')}
							style={{
								background: 'none',
								border: 'none',
								padding: '6px',
								cursor: 'pointer',
								borderRadius: '6px',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.accent.today + '20'; }}
							onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
							title="На сегодня"
						>
							<Clock size={14} color={colors.accent.today} />
						</button>
					)}
					
					{section !== 'done' && (
						<button 
							onClick={() => onMoveTask(task.id, section, 'done')}
							style={{
								background: 'none',
								border: 'none',
								padding: '6px',
								cursor: 'pointer',
								borderRadius: '6px',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#C3E8D120'; }}
							onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
							title="Выполнено"
						>
							<CheckCircle2 size={14} color={colors.accent.done} />
						</button>
					)}
					
					{section === 'done' && (
						<button 
							onClick={() => onMoveTask(task.id, section, 'todo')}
							style={{
								background: 'none',
								border: 'none',
								padding: '6px',
								cursor: 'pointer',
								borderRadius: '6px',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B8D4E820'; }}
							onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
							title="Вернуть"
						>
							<Archive size={14} color={colors.accent.todo} />
						</button>
					)}
					
					<button 
						onClick={() => onDeleteTask(task.id, section)}
						style={{
							background: 'none',
							border: 'none',
							padding: '6px',
							cursor: 'pointer',
							borderRadius: '6px',
							transition: 'all 0.2s'
						}}
						onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FF6B6B20'; }}
						onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
						title="Удалить"
					>
						<X size={14} color="#FF6B6B" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default React.memo(TaskItem);


